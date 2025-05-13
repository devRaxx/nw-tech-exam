import csv
import os
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.post import Post, PostLike, PostDislike
from app.models.comment import Comment, CommentLike, CommentDislike
from app.models.blacklisted_token import BlacklistedToken
from app.core.security import get_password_hash
from app.schemas.user import UserCreate
from app.schemas.post import PostCreate
from sqlalchemy.exc import IntegrityError

import logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

USERS_CSV = os.path.join(os.path.dirname(__file__), 'users.csv')
POSTS_CSV = os.path.join(os.path.dirname(__file__), 'posts.csv')

REQUIRED_USER_FIELDS = {'email', 'username', 'password'}
REQUIRED_POST_FIELDS = {'title', 'body', 'author_id'}


def seed_users(db: Session, csv_path: str):
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            user_data = {
                'email': row.get('email'),
                'username': row.get('username'),
                'password': row.get('password'),
                'full_name': row.get('full_name') or None,
                'is_active': row.get('is_active', 'True').lower() in ('true', '1', 'yes'),
                'is_superuser': row.get('is_superuser', 'False').lower() in ('true', '1', 'yes'),
            }
            if not all(user_data[k] for k in REQUIRED_USER_FIELDS):
                logging.warning(f"Skipping user due to missing required fields: {user_data}")
                continue
            try:
                user_schema = UserCreate(
                    email=user_data['email'],
                    username=user_data['username'],
                    password=user_data['password'],
                    full_name=user_data['full_name']
                )
            except Exception as e:
                logging.warning(f"Skipping user due to validation error: {user_data} | Error: {e}")
                continue
            if db.query(User).filter((User.email == user_schema.email) | (User.username == user_schema.username)).first():
                logging.warning(f"Skipping user due to duplicate email/username: {user_schema.email}, {user_schema.username}")
                continue
            hashed_password = get_password_hash(user_schema.password)
            user = User(
                email=user_schema.email,
                username=user_schema.username,
                hashed_password=hashed_password,
                full_name=user_schema.full_name,
                is_active=user_data['is_active'],
                is_superuser=user_data['is_superuser']
            )
            db.add(user)
        try:
            db.commit()
            logging.info("User seeding complete.")
        except IntegrityError as e:
            db.rollback()
            logging.error(f"Database error during user seeding: {e}")

def seed_posts(db: Session, csv_path: str):
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            post_data = {
                'title': row.get('title'),
                'body': row.get('body'),
                'image_url': row.get('image_url') or None,
                'author_id': row.get('author_id'),
            }
            if not all(post_data[k] for k in REQUIRED_POST_FIELDS):
                logging.warning(f"Skipping post due to missing required fields: {post_data}")
                continue
            author = db.query(User).filter(User.id == post_data['author_id']).first()
            if not author:
                logging.warning(f"Skipping post because author_id {post_data['author_id']} does not exist: {post_data}")
                continue
            try:
                post_schema = PostCreate(
                    title=post_data['title'],
                    body=post_data['body'],
                    image_url=post_data['image_url']
                )
            except Exception as e:
                logging.warning(f"Skipping post due to validation error: {post_data} | Error: {e}")
                continue
            post = Post(
                title=post_schema.title,
                body=post_schema.body,
                image_url=post_schema.image_url,
                author_id=author.id
            )
            db.add(post)
        try:
            db.commit()
            logging.info("Post seeding complete.")
        except IntegrityError as e:
            db.rollback()
            logging.error(f"Database error during post seeding: {e}")

def main():
    db = SessionLocal()
    try:
        logging.info("Seeding users...")
        seed_users(db, USERS_CSV)
        logging.info("Seeding posts...")
        seed_posts(db, POSTS_CSV)
    finally:
        db.close()

if __name__ == "__main__":
    main() 