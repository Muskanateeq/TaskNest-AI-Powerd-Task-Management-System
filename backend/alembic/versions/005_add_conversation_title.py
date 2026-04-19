"""Add title field to conversations table

Revision ID: 005_add_conversation_title
Revises: 004_user_settings
Create Date: 2026-04-20

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '005_add_conversation_title'
down_revision = '004_user_settings'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add title column to conversations table"""
    op.add_column(
        'conversations',
        sa.Column('title', sa.String(length=200), nullable=True)
    )


def downgrade() -> None:
    """Remove title column from conversations table"""
    op.drop_column('conversations', 'title')
