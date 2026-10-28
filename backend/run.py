import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"\n==========================================")
    print(f"🚀 Starting Backend Server on http://{settings.HOST}:{settings.PORT}")
    print(f"📖 Swagger Docs: http://localhost:{settings.PORT}/docs")
    print(f"==========================================\n")
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
