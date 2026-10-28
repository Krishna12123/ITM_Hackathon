import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print("\n==========================================")
    print(f"Starting Backend Server on http://{settings.HOST}:{settings.PORT}")
    print(f"Swagger Docs: http://localhost:{settings.PORT}/docs")
    print("==========================================\n")
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
