from datetime import timedelta, datetime
import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.schemas.auth import OTPRequest, OTPVerify, PasswordReset
from app.api import deps

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Get viewer role by default
    viewer_role = db.query(Role).filter(Role.name == "viewer").first()
    if not viewer_role:
        raise HTTPException(status_code=500, detail="Default role not found. Please initialize DB.")
    
    user = User(
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        password_hash=security.get_password_hash(user_in.password),
        role_id=viewer_role.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- OTP Routes ---

@router.post("/request-otp")
def request_otp(req: OTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # We still return success to prevent email enumeration, but we don't do anything.
        return {"message": "If the email is registered, an OTP has been sent."}
        
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    # Generate 6 digit numeric OTP
    otp_code = ''.join(random.choices(string.digits, k=6))
    
    # Save to user and set expiry to 10 mins from now
    user.otp_code = otp_code
    
    # Timezone-aware UTC datetime for SQLite compatibility
    from datetime import timezone
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.commit()
    
    # Simulated email sending
    print(f"\n" + "="*50)
    print(f"EMAIL SIMULATION: Sending OTP to {user.email}")
    print(f"OTP CODE: {otp_code}")
    print(f"Expires in 10 minutes.")
    print("="*50 + "\n")
    
    return {"message": "OTP sent successfully."}

@router.post("/verify-otp-login", response_model=Token)
def verify_otp_login(req: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")
        
    from datetime import timezone
    now = datetime.now(timezone.utc)
    
    # Check if OTP matches and is not expired
    if user.otp_code != req.otp_code or not user.otp_expires_at or user.otp_expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    # Clear the OTP now that it has been used
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    
    # Generate access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/reset-password")
def reset_password(req: PasswordReset, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")
        
    from datetime import timezone
    now = datetime.now(timezone.utc)
    
    if user.otp_code != req.otp_code or not user.otp_expires_at or user.otp_expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    # Reset password
    user.password_hash = security.get_password_hash(req.new_password)
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    
    return {"message": "Password reset successfully."}

# --- End OTP Routes ---

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(deps.get_current_user)):
    return current_user

# Test RBAC routes
@router.get("/admin-only")
def admin_only(current_user: User = Depends(deps.RoleChecker(["admin"]))):
    return {"message": "Welcome Admin", "user": current_user.email}

@router.get("/dev-only")
def dev_only(current_user: User = Depends(deps.RoleChecker(["admin", "developer"]))):
    return {"message": "Welcome Developer or Admin", "user": current_user.email}
