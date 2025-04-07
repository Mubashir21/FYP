from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from datetime import datetime
import uuid
import json
from core.config import get_supabase, get_api_key

router = APIRouter()

supabase = get_supabase()

@router.post("/register")
async def register_device(
    device_name: str = Header(None),
    registration_code: str = Header(None),
):
    # Step 1: Check if the device exists in the devices table
    device_response = supabase.table("devices").select("id").eq("name", device_name).execute()
    
    if not device_response.data or len(device_response.data) == 0:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device_id = device_response.data[0]["id"]
    
    # Step 2: Check if the registration code exists and is unused
    registration_response = supabase.table("registrations") \
        .select("id, api_key, status") \
        .eq("code", registration_code) \
        .execute()
    
    if not registration_response.data or len(registration_response.data) == 0:
        raise HTTPException(status_code=404, detail="Registration code not found")
    
    registration = registration_response.data[0]
    
    if registration["status"] == "used":
        raise HTTPException(status_code=400, detail="Registration code already used")
    
    # Step 3: Update the registration status to "used" and record usage time
    registration_id = registration["id"]
    api_key = registration["api_key"]
    
    update_data = {
        "status": "used",
        "used_at": datetime.utcnow().isoformat()
    }
    
    supabase.table("registrations").update(update_data).eq("id", registration_id).execute()
    supabase.table("devices").update({"api_key": api_key, "status": "online"}).eq("id", device_id).execute()
    
    # Step 4: Return the API key to the device
    return {
        "status": "success",
        "message": "Device registered successfully",
        "api_key": api_key
    }