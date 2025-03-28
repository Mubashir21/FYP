from fastapi import APIRouter, Header, HTTPException
from datetime import datetime, timezone
from core.config import get_supabase, get_api_key

router = APIRouter(prefix="/handshake")

supabase = get_supabase()

@router.post("")
async def handshake(
    x_device_code: str = Header(None),
    x_api_key: str = Header(None)
):
    """
    Health check endpoint for devices
    - Validates API key
    - Updates device's last ping timestamp
    - Returns server status
    """
    # Validate API key
    if x_api_key != get_api_key():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Validate device code
    if not x_device_code:
        raise HTTPException(status_code=400, detail="Device code is required")
    
    # Current timestamp
    current_time = datetime.now(timezone.utc).isoformat()
    
    try:
        # Update device's last ping
        update_response = (
            supabase.table("devices")
            .update({
                "last_ping": current_time,
            })
            .eq("code", x_device_code)
            .execute()
        )
        
        # Log the update (optional)
        print(f"Updated device {x_device_code} last ping at {current_time}")
        
        return {
            "status": "healthy ma boy",
            "timestamp": current_time,
            "device_code": x_device_code
        }
    
    except Exception as e:
        # Log the error
        print(f"Error updating device ping: {e}")
        
        # Raise an HTTP exception with details
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing health check: {str(e)}"
        )