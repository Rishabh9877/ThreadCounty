import logging
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from middleware.auth import get_current_user
from config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    payload: dict = Depends(get_current_user),
):
    """Upload a fabric image for analysis."""
    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    extension = file.filename.rsplit(".", 1)[-1].lower()
    if extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type .{extension}. Allowed: {', '.join(settings.allowed_extensions)}",
        )

    # Read and validate file size
    content = await file.read()
    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds {settings.max_file_size // (1024 * 1024)}MB limit",
        )

    upload_id = str(uuid.uuid4())
    user_id = payload.get("sub")

    logger.info(f"File uploaded: {file.filename} ({len(content)} bytes) by user {user_id}")

    return {
        "id": upload_id,
        "filename": file.filename,
        "file_size": len(content),
        "status": "processing",
        "user_id": user_id,
        "created_at": datetime.utcnow().isoformat(),
    }
