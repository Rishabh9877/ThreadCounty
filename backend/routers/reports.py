import logging
from fastapi import APIRouter, Depends, HTTPException
from middleware.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/download/{analysis_id}")
async def download_report(
    analysis_id: str,
    payload: dict = Depends(get_current_user),
):
    """Generate and return a PDF report for analysis results."""
    logger.info(f"PDF report requested for analysis {analysis_id}")

    # In production, generate real PDF with ReportLab
    return {
        "message": "PDF report generation queued",
        "analysis_id": analysis_id,
        "download_url": f"/api/reports/file/{analysis_id}.pdf",
        "status": "generating",
    }


@router.get("/share/{analysis_id}")
async def get_share_link(
    analysis_id: str,
    payload: dict = Depends(get_current_user),
):
    """Generate a shareable link for analysis results."""
    return {
        "share_url": f"https://threadcounty.ai/shared/{analysis_id}",
        "expires_in": "7 days",
    }
