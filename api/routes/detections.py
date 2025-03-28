from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from datetime import datetime
import uuid
import json
from core.config import get_supabase, get_api_key

router = APIRouter(prefix="/detect")

supabase = get_supabase()

@router.post("")
async def detect(
    payload: str = Form(...),
    sound_file: UploadFile = File(None),
    image_file: UploadFile = File(None),
    x_api_key: str = Header(None)
):
    # Validate API Key
    if x_api_key != get_api_key():
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

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
        "device_code": data["device_code"],
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

    supabase.table("detections").insert(detection_data).execute()

    return {
        "status": "success",
        "received_at": received_at,
        "payload": data,
        "file_urls": {
            "sound_url": sound_url,
            "image_url": image_url
        }
    }