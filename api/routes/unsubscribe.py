from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse
from core.config import get_supabase

router = APIRouter()
supabase = get_supabase()

@router.get("/unsubscribe", response_class=HTMLResponse)
async def unsubscribe(id: str):
    try:
        # Check if the record exists first
        lookup = supabase.table("stakeholders").select("id").eq("id", id).execute()
        
        if not lookup.data:
            raise HTTPException(status_code=404, detail="Stakeholder not found")
            
        # Updated to handle the current Supabase response structure
        response = supabase.table("stakeholders").update({"subscribed": False}).eq("id", id).execute()
        
        
        return """
        <html>
            <head>
                <title>Unsubscribed</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2em; max-width: 600px; margin: 0 auto; }
                    h2 { color: #4a4a4a; }
                </style>
            </head>
            <body>
                <h2>You have been unsubscribed successfully ✅</h2>
                <p>You will no longer receive alert emails.</p>
            </body>
        </html>
        """
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")