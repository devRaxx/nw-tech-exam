from pydantic_settings import BaseSettings
import os
from typing import Optional
from dotenv import load_dotenv

class Settings(BaseSettings):
    PROJECT_NAME: str = "Blogsite API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings() 