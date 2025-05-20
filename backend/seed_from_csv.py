import os
import sys
from faker import Faker
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

fake = Faker()

NUM_USERS = 1
NUM_POSTS_PER_USER = 1

def seed_users(db: Session, num_users: int = NUM_USERS):
    users = []
    try:
        user_schema = UserCreate(
            username="fromSeeder",
            password="123123123aA",
        )
        hashed_password = get_password_hash(user_schema.password)
        user = User(
            username=user_schema.username,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False
        )
        db.add(user)
        users.append(user)
    except Exception as e:
        logging.warning(f"Error creating initial user: {e}")

    for _ in range(num_users - 1):
        username = fake.user_name()
        password = fake.password(length=8)
        
        try:
            user_schema = UserCreate(
                username=username,
                password=password,
            )
            hashed_password = get_password_hash(user_schema.password)
            user = User(
                username=user_schema.username,
                hashed_password=hashed_password,
                is_active=True,
                is_superuser=False
            )
            db.add(user)
            users.append(user)
        except Exception as e:
            logging.warning(f"Skipping user due to error: {e}")
            continue
    
    try:
        db.commit()
        logging.info(f"Successfully seeded {len(users)} users.")
        return users
    except IntegrityError as e:
        db.rollback()
        logging.error(f"Database error during user seeding: {e}")
        return []

def seed_posts(db: Session, users: list[User], posts_per_user: int = NUM_POSTS_PER_USER):
    total_posts = 0
    if users:
        try:
            post_schema = PostCreate(
                title="Hello Seeders",
                body="This is Seed's first post!",
            )
            post = Post(
                title=post_schema.title,
                body=post_schema.body,
                author_id=users[0].id
            )
            db.add(post)
            total_posts += 1
        except Exception as e:
            logging.warning(f"Error creating initial post: {e}")
            
    for user in users:
        for _ in range(posts_per_user - (1 if user == users[0] else 0)):
            try:
                post_schema = PostCreate(
                    title=fake.sentence(nb_words=3).rstrip('.'),
                    body=fake.paragraph(),
                )
                post = Post(
                    title=post_schema.title,
                    body=post_schema.body,
                    author_id=user.id
                )
                db.add(post)
                total_posts += 1
            except Exception as e:
                logging.warning(f"Skipping post due to error: {e}")
                continue
    
    try:
        db.commit()
        logging.info(f"Successfully seeded {total_posts} posts.")
    except IntegrityError as e:
        db.rollback()
        logging.error(f"Database error during post seeding: {e}")

def main():
    db = SessionLocal()
    try:
        logging.info("Starting database seeding...")
        users = seed_users(db)
        if users:
            logging.info("Seeding posts...")
            seed_posts(db, users)
        logging.info("Database seeding completed.")
    finally:
        db.close()

if __name__ == "__main__":
    main() 