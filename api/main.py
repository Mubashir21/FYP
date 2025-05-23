from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

# Import routers
from routes.detections import router as detections_router
from routes.handshake import router as handshake_router
from routes.register import router as register_router
from routes.unsubscribe import router as unsubscribe_router

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application
    """
    # Initialize the FastAPI application
    app = FastAPI(
        title="Wildlife Detection API",
        description="API for processing wildlife detection events",
        version="1.0.0"
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins (adjust for production)
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods (or specify ["POST", "GET"])
        allow_headers=["*"],
    )

    # Include routers with prefixes
    app.include_router(detections_router, prefix="")
    app.include_router(handshake_router, prefix="")
    app.include_router(register_router, prefix="")
    app.include_router(unsubscribe_router, prefix="")

    # Rate limit error handler
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request, exc):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests, please try again later"}
        )

    return app

# Create the application instance
app = create_application()

print("🚀 Wildlife Detection API Initialized Successfully!")