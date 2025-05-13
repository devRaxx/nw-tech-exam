from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.comment import Comment, CommentLike, CommentDislike
from app.schemas.comment import CommentCreate, CommentUpdate, Comment as CommentSchema, CommentWithStats

router = APIRouter()

@router.get("/post/{post_id}", response_model=List[CommentWithStats])
def read_comments(
    *,
    db: Session = Depends(get_db),
    post_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    comments = db.query(Comment).filter(
        Comment.post_id == post_id,
        Comment.parent_id == None
    ).offset(skip).limit(limit).all()
    
    result = []
    for comment in comments:
        comment_dict = CommentWithStats.from_orm(comment)
        comment_dict.likes_count = len(comment.likes)
        comment_dict.dislikes_count = len(comment.dislikes)
        comment_dict.is_liked = any(like.user_id == current_user.id for like in comment.likes)
        comment_dict.is_disliked = any(dislike.user_id == current_user.id for dislike in comment.dislikes)
        result.append(comment_dict)
    return result

@router.post("/post/{post_id}", response_model=CommentSchema)
def create_comment(
    *,
    db: Session = Depends(get_db),
    post_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    comment = Comment(
        **comment_in.dict(),
        post_id=post_id,
        author_id=current_user.id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.put("/{comment_id}", response_model=CommentSchema)
def update_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    comment_in: CommentUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    for field, value in comment_in.dict(exclude_unset=True).items():
        setattr(comment, field, value)
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.delete("/{comment_id}", response_model=CommentSchema)
def delete_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    db.delete(comment)
    db.commit()
    return comment

@router.post("/{comment_id}/like", response_model=CommentWithStats)
def like_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    dislike = db.query(CommentDislike).filter(
        CommentDislike.comment_id == comment_id,
        CommentDislike.user_id == current_user.id
    ).first()
    if dislike:
        db.delete(dislike)
    
    like = db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.user_id == current_user.id
    ).first()
    if not like:
        like = CommentLike(comment_id=comment_id, user_id=current_user.id)
        db.add(like)
    
    db.commit()
    db.refresh(comment)
    
    comment_dict = CommentWithStats.from_orm(comment)
    comment_dict.likes_count = len(comment.likes)
    comment_dict.dislikes_count = len(comment.dislikes)
    comment_dict.is_liked = True
    comment_dict.is_disliked = False
    return comment_dict

@router.post("/{comment_id}/dislike", response_model=CommentWithStats)
def dislike_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Remove like if exists
    like = db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.user_id == current_user.id
    ).first()
    if like:
        db.delete(like)
    
    # Add dislike if not exists
    dislike = db.query(CommentDislike).filter(
        CommentDislike.comment_id == comment_id,
        CommentDislike.user_id == current_user.id
    ).first()
    if not dislike:
        dislike = CommentDislike(comment_id=comment_id, user_id=current_user.id)
        db.add(dislike)
    
    db.commit()
    db.refresh(comment)
    
    comment_dict = CommentWithStats.from_orm(comment)
    comment_dict.likes_count = len(comment.likes)
    comment_dict.dislikes_count = len(comment.dislikes)
    comment_dict.is_liked = False
    comment_dict.is_disliked = True
    return comment_dict 