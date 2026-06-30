import logging
from services.supabase_client import supabase

logger = logging.getLogger(__name__)

class StorageService:
    @staticmethod
    def upload_file(bucket: str, path: str, file_bytes: bytes, content_type: str = "image/jpeg") -> str:
        """Upload a file to Supabase storage and return its public URL."""
        try:
            res = supabase.storage.from_(bucket).upload(
                path,
                file_bytes,
                {"content-type": content_type}
            )
            # Get public URL
            url = supabase.storage.from_(bucket).get_public_url(path)
            return url
        except Exception as e:
            logger.error(f"Storage upload failed: {e}")
            raise

    @staticmethod
    def delete_file(bucket: str, path: str) -> bool:
        """Delete a file from Supabase storage."""
        try:
            res = supabase.storage.from_(bucket).remove([path])
            return True
        except Exception as e:
            logger.error(f"Storage deletion failed: {e}")
            return False
