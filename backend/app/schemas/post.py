from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .user import User
from .comment import Comment

class PostBase(BaseModel):
    title: str
    body: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None

class PostInDBBase(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Post(PostInDBBase):
    author: User
    likes_count: int = 0
    dislikes_count: int = 0
    comments: List["Comment"] = []

class PostWithStats(Post):
    is_liked: Optional[bool] = None
    is_disliked: Optional[bool] = None 