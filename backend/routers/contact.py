import logging
from fastapi import APIRouter
from models.schemas import ContactMessage

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/submit")
async def submit_contact_form(message: ContactMessage):
    """Submit a contact form message."""
    logger.info(f"Contact form submitted: {message.name} ({message.email}) - {message.subject}")

    # In production: store in Supabase and send email notification
    return {
        "success": True,
        "message": "Your message has been received. We'll respond within 24 hours.",
    }
