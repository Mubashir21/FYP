from fastapi import APIRouter, Header, HTTPException
from datetime import datetime, timezone
from core.config import get_supabase
from typing import Optional

router = APIRouter()

supabase = get_supabase()

@router.post("/handshake")
async def handshake(
    x_device_name: str = Header(None),
    x_api_key: str = Header(None),
    x_battery_level: Optional[float] = Header(None)  # Optional battery level header
):
    """
    Health check endpoint for devices
    - Validates device-specific API key
    - Updates device's last ping timestamp
    - Optionally updates battery level
    - Returns server status
    """
    # Validate device code
    if not x_device_name:
        raise HTTPException(status_code=400, detail="Device name is required")
    
    # Validate API key against the device's registered API key
    try:
        # Get the device from the database
        device_response = (
            supabase.table("devices")
            .select("api_key")
            .eq("name", x_device_name)
            .execute()
        )
        
        # Check if device exists
        if not device_response.data or len(device_response.data) == 0:
            raise HTTPException(status_code=404, detail="Device not found")
        
        # Get the device's API key
        device_api_key = device_response.data[0]["api_key"]
        
        # Validate the provided API key against the device's API key
        if x_api_key != device_api_key:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Current timestamp
        current_time = datetime.now(timezone.utc).isoformat()
        
        update_fields = {
            "last_ping": current_time,
        }

        if x_battery_level is not None:
            update_fields["battery_level"] = x_battery_level

        update_response = (
            supabase.table("devices")
            .update(update_fields)
            .eq("name", x_device_name)
            .execute()
        )
        
        print(f"Updated device {x_device_name} at {current_time} with battery level {x_battery_level}")
        
        return {
            "status": "Online",
            "timestamp": current_time,
            "device_name": x_device_name,
            "battery_level": x_battery_level
        }
    
    except Exception as e:
        # Check if this is an HTTPException we've already raised
        if isinstance(e, HTTPException):
            raise e
        
        # Log the error
        print(f"Error updating device ping: {e}")
        
        # Raise an HTTP exception with details
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing health check: {str(e)}"
        )