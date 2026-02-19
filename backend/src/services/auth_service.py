"""
Authentication Service

Business logic for user authentication, registration, and token management.
"""

import uuid
from typing import Optional
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from src.models.user import User, UserPublic
from src.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from src.utils.security import hash_password, verify_password
from src.utils.jwt import create_access_token, create_refresh_token
from src.config import settings


class AuthService:
    """
    Authentication service for user management and token operations.
    """

    @staticmethod
    async def register_user(
        data: RegisterRequest,
        session: AsyncSession
    ) -> AuthResponse:
        """
        Register a new user.

        Args:
            data: Registration request data
            session: Database session

        Returns:
            AuthResponse with user data and JWT token

        Raises:
            HTTPException: If email already exists
        """
        # Check if user already exists
        result = await session.execute(
            select(User).where(User.email == data.email)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(data.password)

        new_user = User(
            id=user_id,
            email=data.email,
            password_hash=hashed_password,
            name=data.name
        )

        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

        # Generate JWT token
        token_data = {
            "user_id": new_user.id,
            "email": new_user.email
        }
        access_token = create_access_token(token_data)

        # Calculate expiration time in seconds
        expires_in = settings.JWT_EXPIRATION_DAYS * 24 * 60 * 60

        # Return auth response
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=expires_in,
            user=UserResponse(
                id=new_user.id,
                email=new_user.email,
                name=new_user.name,
                created_at=new_user.created_at,
                updated_at=new_user.updated_at
            )
        )

    @staticmethod
    async def login_user(
        data: LoginRequest,
        session: AsyncSession
    ) -> AuthResponse:
        """
        Authenticate user and generate JWT token.

        Args:
            data: Login request data
            session: Database session

        Returns:
            AuthResponse with user data and JWT token

        Raises:
            HTTPException: If credentials are invalid
        """
        # Find user by email
        result = await session.execute(
            select(User).where(User.email == data.email)
        )
        user = result.scalar_one_or_none()

        # Verify user exists and password is correct
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate JWT token
        token_data = {
            "user_id": user.id,
            "email": user.email
        }
        access_token = create_access_token(token_data)

        # Calculate expiration time in seconds
        expires_in = settings.JWT_EXPIRATION_DAYS * 24 * 60 * 60

        # Return auth response
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=expires_in,
            user=UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                created_at=user.created_at,
                updated_at=user.updated_at
            )
        )

    @staticmethod
    async def get_user_by_id(
        user_id: str,
        session: AsyncSession
    ) -> Optional[UserPublic]:
        """
        Get user by ID.

        Args:
            user_id: User ID
            session: Database session

        Returns:
            UserPublic if found, None otherwise
        """
        result = await session.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if user:
            return UserPublic(
                id=user.id,
                email=user.email,
                name=user.name,
                created_at=user.created_at,
                updated_at=user.updated_at
            )

        return None

    @staticmethod
    async def get_current_user(
        user_id: str,
        session: AsyncSession
    ) -> UserPublic:
        """
        Get current authenticated user.

        Args:
            user_id: User ID from JWT token
            session: Database session

        Returns:
            UserPublic

        Raises:
            HTTPException: If user not found
        """
        user = await AuthService.get_user_by_id(user_id, session)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return user
