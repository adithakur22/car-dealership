from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.schemas import UserRegister, UserResponse
from app.security import hash_password


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    registration: UserRegister,
    database_session: Session = Depends(get_db),
) -> User:
    user = User(
        email=str(registration.email).lower(),
        password_hash=hash_password(registration.password),
        role=UserRole.USER,
    )

    database_session.add(user)
    database_session.commit()
    database_session.refresh(user)

    return user