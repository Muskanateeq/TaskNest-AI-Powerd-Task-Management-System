"""
User Model

SQLModel for user authentication and profile management.
Managed by Better Auth but defined here for database schema.
"""

from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, String
from sqlalchemy import TIMESTAMP, func


class User(SQLModel, table=True):
    """
    User model for authentication.

    This model is managed by Better Auth on the frontend,
    but we define it here for database schema and backend queries.
    """
    __tablename__ = "user"

    id: str = Field(
        sa_column=Column(String(255), primary_key=True),
        description="User ID (UUID from Better Auth)"
    )
    email: str = Field(
        sa_column=Column(String(255), unique=True, nullable=False, index=True),
        description="User email address"
    )
    password_hash: str = Field(
        sa_column=Column(String(255), nullable=False),
        description="Hashed password"
    )
    name: Optional[str] = Field(
        default=None,
        sa_column=Column(String(255), nullable=True),
        description="User display name"
    )
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            nullable=False,
            server_default=func.now()
        ),
        description="Account creation timestamp"
    )
    updated_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP,
            nullable=False,
            server_default=func.now(),
            onupdate=func.now()
        ),
        description="Last update timestamp"
    )

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        }


class UserPublic(SQLModel):
    """
    Public user model (excludes sensitive fields).

    Use this for API responses to avoid exposing password_hash.
    """
    id: str
    email: str
    name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
