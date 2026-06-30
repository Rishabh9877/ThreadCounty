import logging
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from config import settings

logger = logging.getLogger(__name__)
security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """Verify a Supabase JWT token and return the payload."""
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no subject")
        return payload
    except JWTError as e:
        logger.warning(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user(request: Request) -> dict:
    """Extract and verify the current user from the Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = auth_header.split(" ")[1]
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    return await verify_token(credentials)


async def require_admin(request: Request) -> dict:
    """Verify the current user has admin role."""
    payload = await get_current_user(request)
    user_metadata = payload.get("user_metadata", {})
    app_metadata = payload.get("app_metadata", {})

    is_admin = (
        user_metadata.get("role") == "admin"
        or app_metadata.get("role") == "admin"
    )

    if not is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    return payload
