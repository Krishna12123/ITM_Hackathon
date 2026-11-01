from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import init_db
from .api.routes import router as api_router
from .api.auth_routes import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed initial admin user
    try:
        init_db()
        print("[Startup] Database initialized and Admin account checked.")
    except Exception as e:
        print(f"[Startup] Warning during DB initialization: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend API for YaatraSaathi with RBAC authentication, Google OAuth, and AI trip synthesis.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Dedicated RBAC Authentication routes
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])

@app.get("/")
def root():
    return {
        "message": "Welcome to the YaatraSaathi Backend API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "auth": f"{settings.API_V1_STR}/auth"
    }
