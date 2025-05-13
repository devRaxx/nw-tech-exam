"""remove_image_url_from_posts

Revision ID: aa534183a7cb
Revises: 23cf1cb61f60
Create Date: 2025-05-14 03:14:57.662561

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa534183a7cb'
down_revision: Union[str, None] = '23cf1cb61f60'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove the image_url column from posts table
    op.drop_column('posts', 'image_url')


def downgrade() -> None:
    # Add back the image_url column to posts table
    op.add_column('posts', sa.Column('image_url', sa.String(), nullable=True))
