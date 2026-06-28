from fastapi import APIRouter
from app.api.endpoints import auth, query, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(query.router, prefix="/query", tags=["query"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
