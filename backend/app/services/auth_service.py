from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import User, UserRole
from app.security import hash_password


def create_user(
    database_session: Session,
    email: str,
    password: str,
) -> User:
    normalized_email = email.lower()

    existing_user = database_session.scalar(
        select(User).where(User.email == normalized_email)
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=normalized_email,
        password_hash=hash_password(password),
        role=UserRole.USER,
    )

    database_session.add(user)
    database_session.commit()
    database_session.refresh(user)

    return user