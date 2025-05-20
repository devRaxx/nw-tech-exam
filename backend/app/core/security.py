from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from jose import jwt, JWTError
from passlib.context import CryptContext

DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES = 15
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityService:
    def __init__(self, secret_key: str, algorithm: str = ALGORITHM):
        if not secret_key:
            raise ValueError("SECRET_KEY cannot be empty.")
        self._secret_key = secret_key
        self._algorithm = algorithm

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        if not plain_password or not hashed_password:
            return False
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        if not password:
            raise ValueError("Password cannot be empty for hashing.")
        return pwd_context.hash(password)

    def create_access_token(
        self,
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = data.copy()

        expire = datetime.now(timezone.utc) + (
            expires_delta if expires_delta is not None
            else timedelta(minutes=DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode["exp"] = expire

        try:
            return jwt.encode(
                to_encode,
                self._secret_key,
                algorithm=self._algorithm
            )
        except JWTError as e:
            print(f"Error encoding JWT: {e}")
            raise