from sqlalchemy.orm import Session

from app.models import User, UserRole
from app.security import hash_password


def create_user(
    database_session: Session,
    email: str,
    password: str,
) -> User:
    user = User(
        email=email.lower(),
        password_hash=hash_password(password),
        role=UserRole.USER,
    )

    database_session.add(user)
    database_session.commit()
    database_session.refresh(user)

    return user