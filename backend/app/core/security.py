from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12 
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        return False

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    try:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (
            expires_delta if expires_delta else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc)
        })
        
        return jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
    except JWTError as e:
        raise JWTError(f"Failed to create access token: {str(e)}") 