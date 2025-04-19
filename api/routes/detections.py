from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from datetime import datetime
import uuid
import json
from core.config import get_supabase, get_api_key
from core.email import send_detection_email
from core.telegram import send_detection_telegram

router = APIRouter()

supabase = get_supabase()

@router.post("/detect")
async def detect(
    payload: str = Form(...),
    sound_file: UploadFile = File(None),
    image_file: UploadFile = File(None),
    x_api_key: str = Header(None)
):

    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    # Get device_name from the payload
    device_name = data.get("device_name")
    if not device_name:
        raise HTTPException(status_code=400, detail="Missing device_name in payload")
    
    # Look up device by code/name to get its API key
    device_response = supabase.table("devices").select("api_key").eq("name", device_name).execute()
    
    if not device_response.data or len(device_response.data) == 0:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device_api_key = device_response.data[0]["api_key"]
    
    # Validate API Key against this specific device's API key
    if x_api_key != device_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Determine detection status based on file presence
    audio_detected = sound_file is not None
    camera_detected = image_file is not None
    
    # Require at least one file to be present
    if not audio_detected and not camera_detected:
        raise HTTPException(status_code=400, detail="At least one file (sound or image) must be provided")
    
    # Override the detection flags in the payload data
    data["audio_detected"] = audio_detected
    data["camera_detected"] = camera_detected

    # Check for confidence levels if files are provided
    if audio_detected and "confidence_level_audio" not in data:
        raise HTTPException(status_code=400, detail="Sound file provided but confidence_level_audio is missing")
    
    if camera_detected and "confidence_level_camera" not in data:
        raise HTTPException(status_code=400, detail="Image file provided but confidence_level_camera is missing")

    received_at = datetime.utcnow().isoformat()
    sound_url = None
    image_url = None

    try:
        if sound_file:
            sound_ext = sound_file.filename.split(".")[-1]
            sound_path = f"{uuid.uuid4()}.{sound_ext}"
            file_content = await sound_file.read()
            
            # Upload with explicit content type
            res = supabase.storage.from_("audio-files").upload(
                path=sound_path,
                file=file_content,
                file_options={"content-type": sound_file.content_type}
            )
            sound_url = supabase.storage.from_("audio-files").get_public_url(sound_path)

    except Exception as e:
        print(f"Sound file upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading sound file: {str(e)}")

    try:
        if image_file:
            image_ext = image_file.filename.split(".")[-1]
            image_path = f"{uuid.uuid4()}.{image_ext}"
            file_content = await image_file.read()
            
            res = supabase.storage.from_("picture-files").upload(
                path=image_path,
                file=file_content,
                file_options={"content-type": image_file.content_type}
            )
            image_url = supabase.storage.from_("picture-files").get_public_url(image_path)

    except Exception as e:
        print(f"Image file upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading image file: {str(e)}")

    detection_data = {
        "device_name": data["device_name"],
        "detected_at": data["detected_at"],
        "received_at": received_at,
        "confidence_level_audio": data.get("confidence_level_audio"),
        "confidence_level_camera": data.get("confidence_level_camera"),
        "audio_detected": audio_detected,
        "camera_detected": camera_detected,
        "weather": json.dumps(data.get("weather", {})),
        "sound_url": sound_url,
        "image_url": image_url,
    }

    try:
        response = supabase.table("detections").insert(detection_data).execute()
        detection_id = response.data[0]['id']
        
        # Send emails and Telegram alerts to stakeholders
        try:
            stakeholders_response = supabase.table("stakeholders").select("*").eq("subscribed", True).execute()
            stakeholders = stakeholders_response.data or []
            await send_detection_email(stakeholders, detection_id, detection_data, supabase)
            await send_detection_telegram(stakeholders, detection_id, detection_data)
        except Exception as e:
            print("Notification error:", e)
    
    except Exception as e:
        print("Insert error:", e)
        raise HTTPException(status_code=500, detail="Error inserting detection data")

    return {
        "status": "success",
        "received_at": received_at,
        "payload": data,
    }