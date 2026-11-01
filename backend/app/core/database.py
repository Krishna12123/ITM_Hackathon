import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
import bcrypt
from .config import settings

# Engine & Session setup
DATABASE_URL = settings.DATABASE_URL
# If SQLite, set check_same_thread to False for multi-threading in FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: f"usr-{uuid.uuid4().hex[:12]}")
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="USER")  # "ADMIN" | "USER"
    role_title = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String, nullable=True)  # For Admin email/password login
    location = Column(String, nullable=True, default="India")
    bio = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role.upper(),
            "role_title": self.role_title or ("System Administrator" if self.role.upper() == "ADMIN" else "Community Explorer"),
            "avatar": self.avatar or ("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" if self.role.upper() == "ADMIN" else "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"),
            "location": self.location or "India",
            "bio": self.bio or "",
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }

def get_db():
    """Dependency for obtaining a SQLAlchemy session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_pw(password: str) -> str:
    """Hash password using direct bcrypt (max 72 bytes)."""
    truncated = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(truncated, salt).decode("utf-8")

def verify_pw(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash."""
    try:
        truncated = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(truncated, hashed_password.encode("utf-8"))
    except Exception:
        return False

def init_db():
    """Create tables and ensure initial ADMIN user is seeded from environment."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin_email = settings.ADMIN_EMAIL.strip().lower()
        existing_admin = db.query(User).filter(User.email == admin_email).first()

        if not existing_admin:
            hashed = hash_pw(settings.ADMIN_PASSWORD)
            admin_user = User(
                id="adm-yaatra-001",
                email=admin_email,
                name="YaatraSaathi Administrator",
                role="ADMIN",
                role_title="Lead System Administrator & Chief Curator",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                hashed_password=hashed,
                location="Jaipur, Rajasthan, India",
                bio="Official administrator account for YaatraSaathi community moderation, platform security, and curation.",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print(f"[DB] Seeded initial Admin user: {admin_email}")
        else:
            # Ensure the role is ADMIN and password matches current env configuration if needed
            if existing_admin.role != "ADMIN":
                existing_admin.role = "ADMIN"
                db.commit()
    except Exception as e:
        print(f"[DB] Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()
