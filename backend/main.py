from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.base import Base
from app.db.session import engine
from app.api.v1.endpoints import auth, posts, comments

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(posts.router, prefix=f"{settings.API_V1_STR}/posts", tags=["posts"])
app.include_router(comments.router, prefix=f"{settings.API_V1_STR}/comments", tags=["comments"])

@app.get("/")
async def root():
    return {"message": "Welcome to Blogsite API"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}