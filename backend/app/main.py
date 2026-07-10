from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, SessionLocal
from app.db.base import Base
from app.api.api import api_router
from app.db.init_db import init_db

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

frontend_url = settings.FRONTEND_URL.strip().rstrip("/")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if frontend_url else ["*"], # Allow all in dev, restrict in prod
    allow_credentials=True if frontend_url else False, # Cannot be True if origins is ["*"]
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
