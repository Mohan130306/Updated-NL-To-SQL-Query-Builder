from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine
from app.db.base import Base
from app.api.api import api_router

# Will create tables temporarily here until alembic is set up (if at all)
# Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

import os

# Set up CORS
origins = [
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if frontend_url else ["*"], # Allow all in dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the NL to SQL API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
