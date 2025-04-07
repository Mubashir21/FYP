from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from datetime import datetime
import uuid
import json
from core.config import get_supabase, get_api_key

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

     # Validate consistency between files and detection flags
    audio_detected = data.get("audio_detected", False)
    camera_detected = data.get("camera_detected", False)
    
    # If a sound file is provided, audio_detected should be True
    if sound_file and not audio_detected:
        raise HTTPException(status_code=400, detail="Sound file provided but audio_detected is False")
    
    # If a image file is provided, camera_detected should be True
    if image_file and not camera_detected:
        raise HTTPException(status_code=400, detail="Image file provided but camera_detected is False")
    
    # If audio_detected is True, confidence_level_audio should be provided
    if audio_detected and "confidence_level_audio" not in data:
        raise HTTPException(status_code=400, detail="audio_detected is True but confidence_level_audio is missing")
    
    # If camera_detected is True, confidence_level_camera should be provided
    if camera_detected and "confidence_level_camera" not in data:
        raise HTTPException(status_code=400, detail="camera_detected is True but confidence_level_camera is missing")

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
        "audio_detected": data.get("audio_detected"),
        "camera_detected": data.get("camera_detected"),
        "weather": json.dumps(data.get("weather", {})),
        "sound_url": sound_url,
        "image_url": image_url,
    }

    try:
        response = supabase.table("detections").insert(detection_data).execute()
    except Exception as e:
        print("Insert error:", e)
        raise HTTPException(status_code=500, detail="Error inserting detection data")

    return {
        "status": "success",
        "received_at": received_at,
        "payload": data,
    }