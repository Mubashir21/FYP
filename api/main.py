from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from functools import lru_cache
from typing import Optional
from datetime import datetime, timezone
import logging
import uuid
import os
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn
from supabase import create_client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pydantic Models
class DetectionPayload(BaseModel):
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    device_id: Optional[str] = Field(None, description="Optional device identifier")
    created_at: Optional[str] = Field(
        None,
        description="Timestamp of the detection event"
    )

class DetectionResponse(BaseModel):
    status: str
    request_id: str
    payload: DetectionPayload

# Settings management
@lru_cache()
def get_settings():
    load_dotenv()
    api_key = os.getenv("API_KEY")
    if not api_key:
        raise ValueError("API_KEY environment variable is not set")
    
    # Initialize Supabase client
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    supabase = create_client(supabase_url, supabase_key)
    return {
        "api_key": api_key,
        "supabase": supabase
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
        if not payload.created_at:
            payload.created_at = datetime.now(timezone.utc).isoformat()

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

        # Insert into the detections table
        supabase = get_settings()["supabase"]
        insert_data = {
            "created_at": payload.created_at,
            "confidence_level": payload.confidence_score,
            "device_code": payload.device_id,
        }

        try:
            response = supabase.table("detections").insert(insert_data).execute()
            
            # The response will have data if successful
            if not response.data:
                logger.error("No data returned from Supabase insert")
                raise HTTPException(
                    status_code=500,
                    detail="Error saving detection to the database"
                )

            logger.info("Detection successfully added to the database")

            return {
                "status": "success",
                "request_id": request.state.request_id,
                "payload": payload
            }

        except Exception as db_error:
            logger.error(f"Database error: {str(db_error)}")
            raise HTTPException(
                status_code=500,
                detail="Error saving detection to the database"
            )

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
        "timestamp": datetime.now(timezone.utc).isoformat()
    }