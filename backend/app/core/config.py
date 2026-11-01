import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "YaatraSaathi API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./yaatrasaathi.db")
    
    # Supabase (optional remote sync)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://jxtmvfamgyrmnlzfgfwq.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_4-sM0agOoz1UH8I5zUKBGw_LTTn-9Qy")
    
    # JWT & Session Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "yaatrasaathi-super-secret-jwt-key-2026-production-grade")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))  # 7 days
    
    # Fixed Admin Credentials (configured through backend environment variables)
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@yaatrasathi.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "YaatraAdmin@2026!Secure")
    
    # Google OAuth 2.0 Configuration
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # Rate Limiting
    MAX_LOGIN_ATTEMPTS: int = int(os.getenv("MAX_LOGIN_ATTEMPTS", 5))
    LOGIN_LOCKOUT_MINUTES: int = int(os.getenv("LOGIN_LOCKOUT_MINUTES", 15))

    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
