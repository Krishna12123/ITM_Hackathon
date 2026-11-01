from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..core.database import get_db, User, verify_pw
from ..core.config import settings
from ..services.auth_service import (
    create_access_token,
    verify_google_id_token,
    admin_rate_limiter,
    require_authenticated_user,
    require_admin
)

router = APIRouter()

# Pydantic Schemas
class AdminLoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str
    user_data: Optional[dict] = None

class ModerationActionRequest(BaseModel):
    action: str  # "approve" | "reject" | "request-changes"
    reason: Optional[str] = ""

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# In-memory moderation queue for admin actions with initial seeded submissions
MODERATION_DATABASE = [
    {
        "id": "mod-1",
        "title": "Old Town Heritage Brass Bell Artisan Workshop",
        "category": "Arts & Crafts",
        "location": "Jorhat Town, Assam",
        "submittedBy": "Pranjal Saikia",
        "date": "27 Oct 2026",
        "status": "Pending",
        "description": "One of the last traditional bell-metal forging guilds using lost-wax casting methods in Upper Assam.",
        "landmark": "Behind Old Bazaar Namghar",
        "notes": "Spoke to Master Artisan Biren. Guided visits available on weekday mornings.",
        "hasPhoto": True
    },
    {
        "id": "mod-2",
        "title": "Ancient Stepwell at Chand Baori Outskirts",
        "category": "Historical Site",
        "location": "Abhaneri, Rajasthan",
        "submittedBy": "Devendra Rathore",
        "date": "28 Oct 2026",
        "status": "Pending",
        "description": "A smaller, undisturbed 9th-century stepwell 3km east of the main site with intricate stone carvings.",
        "landmark": "Near neem tree grove, village track 4",
        "notes": "Best photographed at 7 AM. No ticket required, respect local temple boundary.",
        "hasPhoto": True
    },
    {
        "id": "mod-3",
        "title": "Alder Tree Terrace View Gazebo",
        "category": "Village Experience",
        "location": "Khonoma Village, Nagaland",
        "submittedBy": "Imti Longkumer",
        "date": "26 Oct 2026",
        "status": "Pending",
        "description": "Community-maintained stone gazebo overlooking organic alder tree terrace farming.",
        "landmark": "Upper Morung path, near village gate 2",
        "notes": "Requires walking 15 minutes on paved village steps.",
        "hasPhoto": False
    }
]

@router.post("/admin/login", response_model=AuthResponse)
def admin_login(payload: AdminLoginRequest, request: Request, db: Session = Depends(get_db)):
    """
    Dedicated Admin Login endpoint.
    Verifies admin credentials, enforces rate limiting, and issues ADMIN JWT token.
    """
    email_key = payload.email.strip().lower()

    # 1. Rate Limiting Check
    is_locked, remaining_seconds = admin_rate_limiter.is_locked_out(email_key)
    if is_locked:
        minutes = int(remaining_seconds / 60) + 1
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Account temporarily locked for {minutes} minute(s)."
        )

    # 2. Query admin user in DB
    user = db.query(User).filter(User.email == email_key).first()

    # If no DB record exists or role is not ADMIN, record failure
    if not user or user.role.upper() != "ADMIN":
        admin_rate_limiter.record_failure(email_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials."
        )

    # 3. Verify password hash using direct bcrypt
    is_valid = False
    if user.hashed_password:
        is_valid = verify_pw(payload.password, user.hashed_password)
    elif payload.password == settings.ADMIN_PASSWORD:
        # Fallback if admin env password matches
        is_valid = True

    if not is_valid:
        admin_rate_limiter.record_failure(email_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials. Please check your password."
        )

    # 4. Successful login: clear rate limiter
    admin_rate_limiter.record_success(email_key)

    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()

    # Issue JWT token with role ADMIN
    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": "ADMIN"
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.post("/google", response_model=AuthResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    User Login with Google OAuth 2.0 flow.
    Verifies Google ID token, finds or registers user, issues USER JWT token.
    """
    # 1. Verify Google token or unpack testing payload
    google_data = verify_google_id_token(payload.credential)

    # Support optional user_data overrides if provided by client in test mode
    if payload.user_data:
        if payload.user_data.get("email"):
            google_data["email"] = payload.user_data["email"].lower()
        if payload.user_data.get("name"):
            google_data["name"] = payload.user_data["name"]
        if payload.user_data.get("avatar"):
            google_data["avatar"] = payload.user_data["avatar"]

    email = google_data["email"].lower()
    google_id = google_data["google_id"]

    # 2. Check for existing user by google_id or email
    user = db.query(User).filter((User.google_id == google_id) | (User.email == email)).first()

    if not user:
        # Create new user record
        user = User(
            email=email,
            name=google_data["name"],
            role="USER",
            role_title="Community Explorer",
            avatar=google_data.get("avatar"),
            google_id=google_id,
            location="India",
            bio="Passionate traveler discovering offbeat cultural gems across India.",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"[AUTH] Registered new Google user: {email} ({user.id})")
    else:
        # Existing user logging in: update metadata
        if not user.google_id:
            user.google_id = google_id
        if google_data.get("avatar") and not user.avatar:
            user.avatar = google_data["avatar"]
        user.last_login = datetime.utcnow()
        db.commit()
        print(f"[AUTH] Existing Google user logged in: {email}")

    # Ensure role is preserved (clean separation between ADMIN and USER)
    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role.upper()
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.get("/me")
def get_current_user_profile(user: User = Depends(require_authenticated_user)):
    """Return currently authenticated user profile."""
    return {
        "status": "success",
        "user": user.to_dict()
    }

@router.post("/logout")
def logout(user: Optional[User] = Depends(require_authenticated_user)):
    """Invalidate session / logout confirmation."""
    return {
        "status": "success",
        "message": "Logged out successfully"
    }

# =========================================================================
# RBAC Protected Admin Endpoints
# =========================================================================

@router.get("/admin/moderation-queue")
def get_moderation_queue(admin: User = Depends(require_admin)):
    """
    Admin-only: Retrieve all pending community submissions in moderation queue.
    Strictly forbidden for normal users (enforced by require_admin dependency).
    """
    return {
        "status": "success",
        "count": len(MODERATION_DATABASE),
        "submissions": MODERATION_DATABASE
    }

@router.post("/admin/moderation/{submission_id}/action")
def execute_moderation_action(
    submission_id: str,
    action_req: ModerationActionRequest,
    admin: User = Depends(require_admin)
):
    """
    Admin-only: Approve, reject, or request changes on a community submission.
    Strictly forbidden for normal users.
    """
    item = next((sub for sub in MODERATION_DATABASE if sub["id"] == submission_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")

    if action_req.action == "approve":
        item["status"] = "Approved"
        item["feedback"] = f"Approved by Administrator {admin.name}. Added to community catalog."
    elif action_req.action == "reject":
        item["status"] = "Rejected"
        item["feedback"] = f"Rejected: {action_req.reason or 'Does not meet community standards.'}"
    elif action_req.action == "request-changes":
        item["status"] = "Needs Changes"
        item["feedback"] = f"Review requested: {action_req.reason}"
    else:
        raise HTTPException(status_code=400, detail="Invalid action type")

    return {
        "status": "success",
        "submission_id": submission_id,
        "action": action_req.action,
        "new_status": item["status"],
        "moderator": admin.name
    }
