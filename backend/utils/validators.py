from fastapi import HTTPException
from config import settings

def validate_image_file(filename: str, file_size: int) -> bool:
    """Validate image file extension and size."""
    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    extension = filename.rsplit(".", 1)[-1].lower()
    if extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(settings.allowed_extensions)}"
        )
        
    if file_size > settings.max_file_size:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum size of {settings.max_file_size // (1024*1024)}MB"
        )
        
    return True
