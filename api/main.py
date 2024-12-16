# api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

# Pydantic Model for Validation
class DetectionPayload(BaseModel):
    location: dict
    device_id: str = None
    timestamp: str = None

# FastAPI App
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def process_detection(payload: DetectionPayload):
    try:
        # Validate confidence score
        if payload.confidence_score < 0.5:
            raise HTTPException(status_code=400, detail="Low confidence detection")

        # Prepare detection data
        detection_data = {
            'id': str(uuid.uuid4()),
            'confidence_score': payload.confidence_score,
            'location': payload.location,
            'device_id': payload.device_id,
            'timestamp': payload.timestamp or "not provided",
        }

        # Return the detection data for testing
        return {
            "status": "success", 
            "detection_data": detection_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
