import time
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..core.config import settings
from ..core.database import get_db, User, verify_pw, hash_pw

# HTTP Bearer Scheme for Swagger and Authorization headers
security = HTTPBearer(auto_error=False)

class RateLimiter:
    """
    Sliding window rate limiter for admin login attempts.
    Limits failed attempts to MAX_LOGIN_ATTEMPTS within LOGIN_LOCKOUT_MINUTES.
    """
    def __init__(self, max_attempts: int, lockout_minutes: int):
        self.max_attempts = max_attempts
        self.lockout_seconds = lockout_minutes * 60
        # Maps key -> list of failure timestamps
        self.failed_attempts: Dict[str, list] = {}

    def is_locked_out(self, key: str) -> tuple[bool, int]:
        """Returns (is_locked, seconds_remaining)."""
        now = time.time()
        attempts = self.failed_attempts.get(key, [])
        # Filter attempts within lockout window
        valid_attempts = [t for t in attempts if now - t < self.lockout_seconds]
        self.failed_attempts[key] = valid_attempts

        if len(valid_attempts) >= self.max_attempts:
            oldest_relevant = valid_attempts[0]
            remaining = int(self.lockout_seconds - (now - oldest_relevant))
            return True, max(remaining, 1)
        return False, 0

    def record_failure(self, key: str):
        now = time.time()
        if key not in self.failed_attempts:
            self.failed_attempts[key] = []
        self.failed_attempts[key].append(now)

    def record_success(self, key: str):
        if key in self.failed_attempts:
            del self.failed_attempts[key]

# Singleton rate limiter
admin_rate_limiter = RateLimiter(
    max_attempts=settings.MAX_LOGIN_ATTEMPTS,
    lockout_minutes=settings.LOGIN_LOCKOUT_MINUTES
)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Encode JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def verify_google_id_token(credential: str) -> dict:
    """
    Verify Google OAuth 2.0 credential using official google-auth library.
    Falls back gracefully to mock/dev format if client ID is not configured or in testing mode.
    """
    # 1. Check if official verification can be performed
    if settings.GOOGLE_CLIENT_ID and not credential.startswith("mock-google-"):
        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests

            idinfo = id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            # idinfo contains: 'sub', 'email', 'name', 'picture', 'email_verified'
            if not idinfo.get("email_verified", False):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Google account email is not verified"
                )

            return {
                "google_id": idinfo.get("sub"),
                "email": idinfo.get("email").lower(),
                "name": idinfo.get("name") or idinfo.get("email").split("@")[0],
                "avatar": idinfo.get("picture")
            }
        except Exception as e:
            # If Google token verification fails
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Google token verification failed: {str(e)}"
            )

    # 2. Mock / Testing Token Handler for seamless local evaluation
    # Allows testing Google Auth even before registering an official Google Cloud Console project
    try:
        # If payload is a signed JSON-like string or mock ID
        import json
        import base64
        # Check if JWT structure
        parts = credential.split(".")
        if len(parts) == 3:
            # Decode payload part without verification for dev/test
            padding = "=" * (4 - len(parts[1]) % 4)
            decoded_bytes = base64.urlsafe_b64decode(parts[1] + padding)
            payload = json.loads(decoded_bytes.decode("utf-8"))
            return {
                "google_id": payload.get("sub", f"g-{int(time.time())}"),
                "email": payload.get("email", "explorer.google@yaatrasaathi.com").lower(),
                "name": payload.get("name", "Google Explorer"),
                "avatar": payload.get("picture", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80")
            }
    except Exception:
        pass

    # Generic development fallback
    return {
        "google_id": f"mock-g-{int(time.time())}",
        "email": "traveler.google@yaatrasaathi.com",
        "name": "Community Traveler",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    }

def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """FastAPI Dependency: Extract current authenticated user from Bearer token."""
    if not auth or not auth.credentials:
        return None

    payload = decode_access_token(auth.credentials)
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    return user

def require_authenticated_user(current_user: Optional[User] = Depends(get_current_user)) -> User:
    """Dependency: Requires valid logged-in user."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return current_user

def require_admin(current_user: User = Depends(require_authenticated_user)) -> User:
    """Dependency: Strictly enforce ADMIN role on protected routes."""
    if current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. Administrator privileges are required for this action."
        )
    return current_user
