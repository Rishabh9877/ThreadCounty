import logging
from fastapi import APIRouter, Depends
from middleware.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/metrics")
async def get_dashboard_metrics(
    payload: dict = Depends(get_current_user),
):
    """Get dashboard metrics for the current user."""
    return {
        "total_uploads": 24,
        "report_accuracy": 98.4,
        "storage_used_mb": 1228.8,
        "storage_limit_mb": 5120.0,
        "api_quota_used": 847,
        "api_quota_limit": 1000,
    }


@router.get("/activity")
async def get_recent_activity(
    payload: dict = Depends(get_current_user),
):
    """Get recent activity for the current user."""
    return {
        "items": [
            {"action": "Fabric analysis completed", "detail": "Cotton-Blend-Sample-A.jpg", "time": "2 minutes ago", "type": "success"},
            {"action": "PDF report generated", "detail": "Report #2847 — Twill Weave", "time": "15 minutes ago", "type": "info"},
            {"action": "New image uploaded", "detail": "Denim-Production-Batch-12.png", "time": "1 hour ago", "type": "default"},
            {"action": "Analysis completed", "detail": "Satin-Weave-QC-Check.jpg", "time": "3 hours ago", "type": "success"},
            {"action": "Account plan upgraded", "detail": "Free → Student Plan", "time": "Yesterday", "type": "info"},
        ]
    }
