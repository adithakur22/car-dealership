from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.exceptions import EmailAlreadyRegisteredError
from app.models import User
from app.schemas import UserRegister, UserResponse
from app.services.auth_service import create_user


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
    try:
        return create_user(
            database_session=database_session,
            email=str(registration.email),
            password=registration.password,
        )
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error