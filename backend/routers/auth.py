import logging
from fastapi import APIRouter, Request, Depends
from middleware.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/me")
async def get_profile(payload: dict = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "full_name": payload.get("user_metadata", {}).get("full_name"),
        "role": payload.get("user_metadata", {}).get("role", "user"),
        "plan": "free",
    }


@router.get("/session")
async def check_session(payload: dict = Depends(get_current_user)):
    """Validate the current session is still active."""
    return {
        "valid": True,
        "user_id": payload.get("sub"),
        "expires_at": payload.get("exp"),
    }
