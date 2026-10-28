# Backend Service (Python / FastAPI)

This is the backend API service built with Python and FastAPI. It communicates with the React frontend and connects with the machine learning model in `ml_model/`.

## Folder Architecture

```text
backend/
├── app/
│   ├── api/            # API endpoints & route handlers
│   │   ├── __init__.py
│   │   └── routes.py   # /api/health and /api/predict
│   ├── core/           # Configuration and settings
│   │   ├── __init__.py
│   │   └── config.py
│   ├── models/         # Pydantic schemas for request/response
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── services/       # Business logic and ML model integrations
│   │   ├── __init__.py
│   │   └── ml_service.py
│   ├── __init__.py
│   └── main.py         # FastAPI app entry point & CORS
├── .env                # Local environment variables
├── .env.example
├── README.md
├── requirements.txt    # Python dependencies
└── run.py              # Runner script
```

## Running the Backend

### Prerequisites
- Python 3.10+

### Option 1: Direct Run (Recommended)
```bash
cd backend
python3 run.py
```

### Option 2: Virtual Environment Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

The server will be available at:
- **API URL:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/api/health`
