from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserResponse
from app.api import deps
from pydantic import BaseModel

router = APIRouter()

class RoleUpdateRequest(BaseModel):
    role_name: str

@router.get("/", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.RoleChecker(["admin"]))
):
    users = db.query(User).all()
    return users

@router.put("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    request: RoleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.RoleChecker(["admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    role = db.query(Role).filter(Role.name == request.role_name).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role name")
        
    user.role_id = role.id
    db.commit()
    db.refresh(user)
    return user
