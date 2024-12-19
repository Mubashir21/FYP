from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from functools import lru_cache
from typing import Optional
from datetime import datetime
import logging
import uuid
import os
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pydantic Models
class DetectionPayload(BaseModel):
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    device_id: Optional[int] = Field(None, description="Optional device identifier")
    timestamp: Optional[str] = Field(
        None,
        description="Timestamp of the detection event"
    )

class DetectionResponse(BaseModel):
    status: str
    request_id: str

# Settings management
@lru_cache()
def get_settings():
    load_dotenv()
    api_key = os.getenv("API_KEY")
    if not api_key:
        raise ValueError("API_KEY environment variable is not set")
    return {
        "api_key": api_key
    }

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

# FastAPI App
app = FastAPI(
    title="Detection API",
    description="API for processing detection events",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "X-API-Key"],
)

# Middleware for request ID
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Rate limit error handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests"}
    )

# API Key validation
async def validate_api_key(x_api_key: str = Header(..., description="API Key for authentication")):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API Key is required")
    if x_api_key != get_settings()["api_key"]:
        logger.warning("Invalid API key attempt")
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key

# Endpoints
@app.post("/detect", response_model=DetectionResponse)
@limiter.limit("5/minute")
async def process_detection(
    request: Request,
    payload: DetectionPayload,
    api_key_validation: str = Depends(validate_api_key)
):
    try:
        # Add timestamp if not provided
        if not payload.timestamp:
            payload.timestamp = datetime.utcnow().isoformat()

        # Validate confidence score
        if payload.confidence_score < 0.75:
            logger.warning(f"Low confidence detection: {payload.confidence_score}")
            raise HTTPException(
                status_code=400,
                detail="Low confidence detection"
            )

        logger.info(
            f"Processing detection with confidence {payload.confidence_score}"
            f" for device {payload.device_id}"
        )

        return {
            "status": "success",
            "request_id": request.state.request_id
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing detection: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

# if __name__ == "__main__":
#     settings = get_settings()  # Validate settings on startup
#     uvicorn.run(app, host="0.0.0.0", port=8000)