import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "ITM Hackathon API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://jxtmvfamgyrmnlzfgfwq.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_4-sM0agOoz1UH8I5zUKBGw_LTTn-9Qy")
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
