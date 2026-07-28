from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User, UserRole


bearer_scheme = HTTPBearer(auto_error=False)


def create_authentication_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    database_session: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise create_authentication_error()

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )

        subject = payload.get("sub")

        if not isinstance(subject, str):
            raise create_authentication_error()

        user_id = UUID(subject)
    except (InvalidTokenError, ValueError, TypeError) as error:
        raise create_authentication_error() from error

    user = database_session.get(User, user_id)

    if user is None:
        raise create_authentication_error()

    return user

from app.models import UserRole


def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user