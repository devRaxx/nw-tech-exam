"""remove_email_and_fullname_from_users

Revision ID: 14c60885b93f
Revises: aa534183a7cb
Create Date: 2025-05-14 03:41:27.595580

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14c60885b93f'
down_revision: Union[str, None] = 'aa534183a7cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop email and fullname columns
    op.drop_column('users', 'email')
    op.drop_column('users', 'full_name')


def downgrade() -> None:
    # Add back email and fullname columns
    op.add_column('users', sa.Column('email', sa.String(), nullable=True))
    op.add_column('users', sa.Column('full_name', sa.String(), nullable=True))
