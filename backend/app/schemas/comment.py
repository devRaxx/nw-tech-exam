from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .user import User

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class CommentInDBBase(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Comment(CommentInDBBase):
    author: User
    replies: List["Comment"] = []
    likes_count: int = 0
    dislikes_count: int = 0

class CommentWithStats(Comment):
    is_liked: Optional[bool] = None
    is_disliked: Optional[bool] = None 