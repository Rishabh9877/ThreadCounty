from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "user"
    plan: str = "free"


class UploadResponse(BaseModel):
    id: str
    filename: str
    file_url: str
    file_size: int
    status: str = "processing"
    created_at: datetime


class AnalysisResult(BaseModel):
    id: str
    upload_id: str
    thread_density: int = Field(ge=50, le=500, description="Threads per cm")
    warp_count: int = Field(ge=20, le=300)
    weft_count: int = Field(ge=20, le=300)
    fabric_type: str = Field(description="Cotton, Denim, Twill, Satin, Linen")
    confidence: float = Field(ge=0, le=100)
    uniformity: float = Field(ge=0, le=100)
    ai_suggestions: list[dict]
    created_at: datetime


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str
    subject: str = Field(min_length=2, max_length=200)
    message: str = Field(min_length=10, max_length=5000)


class DashboardMetrics(BaseModel):
    total_uploads: int
    report_accuracy: float
    storage_used_mb: float
    storage_limit_mb: float
    api_quota_used: int
    api_quota_limit: int


class AdminMetrics(BaseModel):
    total_users: int
    total_uploads: int
    active_subscriptions: int
    system_uptime: float


class ErrorResponse(BaseModel):
    detail: str
    status_code: int = 400
