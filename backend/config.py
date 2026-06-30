import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    supabase_url: str = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
    supabase_key: str = os.getenv("SUPABASE_KEY", "your-anon-key")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "your-service-key")
    jwt_secret: str = os.getenv("JWT_SECRET", "your-jwt-secret")
    max_file_size: int = 5 * 1024 * 1024  # 5MB
    allowed_extensions: list[str] = ["jpg", "jpeg", "png"]
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
