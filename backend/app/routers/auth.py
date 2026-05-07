from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from ..models.all_models import Users
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token
from ..services import security, email
from ..database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    hashed_password = security.get_password_hash(user.password)
    new_user = Users(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password,
        role_id=1,
        status='inactive'
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = security.create_verification_token(new_user.email)
    background_tasks.add_task(email.send_verification_email, new_user.email, token)
    
    return new_user

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == user_credentials.email).first()
    
    if not user or not security.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    if user.status != 'active':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email của bạn.",
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user.user_id,
        "full_name": user.full_name
    }

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    email_address = security.verify_email_token(token)
    if not email_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã xác thực không hợp lệ hoặc đã hết hạn",
        )
    
    user = db.query(Users).filter(Users.email == email_address).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản để xác thực",
        )
        
    if user.status == 'active':
        return RedirectResponse(url="http://localhost:5173/login?verified=already")
        
    user.status = 'active'
    db.commit()
    
    return RedirectResponse(url="http://localhost:5173/login?verified=true")
