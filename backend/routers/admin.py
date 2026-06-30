import logging
from fastapi import APIRouter, Depends, Query
from middleware.auth import require_admin

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/metrics")
async def get_admin_metrics(payload: dict = Depends(require_admin)):
    """Get system-wide admin metrics."""
    return {
        "total_users": 2847,
        "total_uploads": 18293,
        "active_subscriptions": 1204,
        "system_uptime": 99.9,
    }


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    payload: dict = Depends(require_admin),
):
    """List all users with pagination (admin only)."""
    mock_users = [
        {"id": "1", "email": "sarah@mit.edu", "name": "Dr. Sarah Chen", "plan": "Professional", "uploads": 342, "role": "user", "joined": "2025-03-15"},
        {"id": "2", "email": "rajesh@arvind.com", "name": "Rajesh Patel", "plan": "Enterprise", "uploads": 1204, "role": "user", "joined": "2024-11-20"},
        {"id": "3", "email": "emma@parsons.edu", "name": "Emma Williams", "plan": "Student", "uploads": 78, "role": "user", "joined": "2025-08-01"},
        {"id": "4", "email": "admin@threadcounty.ai", "name": "Admin Account", "plan": "Enterprise", "uploads": 0, "role": "admin", "joined": "2024-01-01"},
        {"id": "5", "email": "john@textilecorp.com", "name": "John Smith", "plan": "Free", "uploads": 5, "role": "user", "joined": "2026-06-20"},
    ]

    return {
        "users": mock_users,
        "total": len(mock_users),
        "page": page,
        "limit": limit,
    }


@router.get("/moderation")
async def get_moderation_queue(payload: dict = Depends(require_admin)):
    """Get content moderation queue (admin only)."""
    return {
        "items": [
            {"id": "m1", "fileName": "suspicious-upload-1.jpg", "user": "unknown@temp.com", "reason": "Potential non-fabric content", "date": "2026-06-28"},
            {"id": "m2", "fileName": "blurry-scan-test.png", "user": "test@test.com", "reason": "Low quality / spam", "date": "2026-06-27"},
        ],
        "total": 2,
    }
