from sqlalchemy import Column, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel

class PostReaction(BaseModel):
    __tablename__ = "post_reactions"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    is_like = Column(Boolean, nullable=False)  # True for like, False for dislike

    # Relationships
    user = relationship("User", back_populates="post_reactions")
    post = relationship("Post", back_populates="reactions")

class CommentReaction(BaseModel):
    __tablename__ = "comment_reactions"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=False)
    is_like = Column(Boolean, nullable=False)  # True for like, False for dislike

    # Relationships
    user = relationship("User", back_populates="comment_reactions")
    comment = relationship("Comment", back_populates="reactions") 