import logging
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from middleware.auth import get_current_user
from services.mock_ai_engine import analyze_fabric

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/run")
async def run_analysis(
    file: UploadFile = File(...),
    payload: dict = Depends(get_current_user),
):
    """Run AI analysis on an uploaded fabric image."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    user_id = payload.get("sub")

    logger.info(f"Running analysis on {file.filename} for user {user_id}")

    results = analyze_fabric(content, file.filename)

    analysis_id = str(uuid.uuid4())

    return {
        "id": analysis_id,
        "upload_id": str(uuid.uuid4()),
        "filename": file.filename,
        "status": "completed",
        "results": results,
        "created_at": datetime.utcnow().isoformat(),
    }


@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: str,
    payload: dict = Depends(get_current_user),
):
    """Get analysis results by ID (mock)."""
    # In production, fetch from Supabase
    return {
        "id": analysis_id,
        "status": "completed",
        "results": {
            "thread_density": 186,
            "warp_count": 102,
            "weft_count": 84,
            "fabric_type": "Cotton",
            "confidence": 97.2,
            "uniformity": 92.5,
            "ai_suggestions": [
                {"type": "quality", "text": "Thread density is within standard range for cotton fabrics."},
                {"type": "info", "text": "Plain weave structure detected with 97.2% confidence."},
            ],
        },
    }


@router.get("/history/list")
async def get_analysis_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    payload: dict = Depends(get_current_user),
):
    """Get paginated analysis history for the current user."""
    user_id = payload.get("sub")

    # Mock history data
    mock_items = [
        {"id": str(uuid.uuid4()), "filename": f"Sample-{i}.jpg", "fabric_type": ["Cotton", "Denim", "Twill", "Satin", "Linen"][i % 5], "thread_density": 130 + (i * 17) % 160, "confidence": 90 + (i * 3) % 9, "status": "completed", "created_at": datetime.utcnow().isoformat()}
        for i in range(20)
    ]

    start = (page - 1) * limit
    end = start + limit

    return {
        "items": mock_items[start:end],
        "total": len(mock_items),
        "page": page,
        "limit": limit,
        "total_pages": (len(mock_items) + limit - 1) // limit,
    }
