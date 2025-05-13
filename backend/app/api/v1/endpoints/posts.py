from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.models.user import User
from app.models.post import Post, PostLike, PostDislike
from app.schemas.post import PostCreate, PostUpdate, Post as PostSchema, PostWithStats

router = APIRouter()

@router.get("/", response_model=List[PostWithStats])
def read_posts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user_optional),
) -> Any:
    """
    Retrieve posts.
    """
    posts = db.query(Post).offset(skip).limit(limit).all()
    result = []
    for post in posts:
        post_dict = PostWithStats.from_orm(post)
        post_dict.likes_count = len(post.likes)
        post_dict.dislikes_count = len(post.dislikes)
        if current_user:
            post_dict.is_liked = any(like.user_id == current_user.id for like in post.likes)
            post_dict.is_disliked = any(dislike.user_id == current_user.id for dislike in post.dislikes)
        else:
            post_dict.is_liked = False
            post_dict.is_disliked = False
        result.append(post_dict)
    return result

@router.post("/", response_model=PostSchema)
def create_post(
    *,
    db: Session = Depends(get_db),
    post_in: PostCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new post.
    """
    post = Post(
        **post_in.dict(),
        author_id=current_user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.put("/{post_id}", response_model=PostSchema)
def update_post(
    *,
    db: Session = Depends(get_db),
    post_id: int,
    post_in: PostUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a post.
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    for field, value in post_in.dict(exclude_unset=True).items():
        setattr(post, field, value)
    
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}", response_model=PostSchema)
def delete_post(
    *,
    db: Session = Depends(get_db),
    post_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete a post.
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    db.delete(post)
    db.commit()
    return post

@router.post("/{post_id}/like", response_model=PostWithStats)
def like_post(
    *,
    db: Session = Depends(get_db),
    post_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    dislike = db.query(PostDislike).filter(
        PostDislike.post_id == post_id,
        PostDislike.user_id == current_user.id
    ).first()
    if dislike:
        db.delete(dislike)
    
    like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()
    if not like:
        like = PostLike(post_id=post_id, user_id=current_user.id)
        db.add(like)
    
    db.commit()
    db.refresh(post)
    
    post_dict = PostWithStats.from_orm(post)
    post_dict.likes_count = len(post.likes)
    post_dict.dislikes_count = len(post.dislikes)
    post_dict.is_liked = True
    post_dict.is_disliked = False
    return post_dict

@router.post("/{post_id}/dislike", response_model=PostWithStats)
def dislike_post(
    *,
    db: Session = Depends(get_db),
    post_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Dislike a post.
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()
    if like:
        db.delete(like)
    
    dislike = db.query(PostDislike).filter(
        PostDislike.post_id == post_id,
        PostDislike.user_id == current_user.id
    ).first()
    if not dislike:
        dislike = PostDislike(post_id=post_id, user_id=current_user.id)
        db.add(dislike)
    
    db.commit()
    db.refresh(post)
    
    post_dict = PostWithStats.from_orm(post)
    post_dict.likes_count = len(post.likes)
    post_dict.dislikes_count = len(post.dislikes)
    post_dict.is_liked = False
    post_dict.is_disliked = True
    return post_dict 