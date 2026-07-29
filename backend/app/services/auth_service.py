from sqlalchemy import select
from sqlalchemy.orm import Session

from app.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
)
from app.models import User, UserRole
from app.security import (
    create_access_token,
    hash_password,
    verify_password,
)


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
        raise EmailAlreadyRegisteredError

    user = User(
        email=normalized_email,
        password_hash=hash_password(password),
        role=UserRole.USER,
    )

    database_session.add(user)
    database_session.commit()
    database_session.refresh(user)

    return user


def authenticate_user(
    database_session: Session,
    email: str,
    password: str,
) -> str:
    normalized_email = email.lower()

    user = database_session.scalar(
        select(User).where(User.email == normalized_email)
    )

    if user is None or not verify_password(
        plain_password=password,
        hashed_password=user.password_hash,
    ):
        raise InvalidCredentialsError

    return create_access_token(
    subject=str(user.id),
    role=user.role.value,
)