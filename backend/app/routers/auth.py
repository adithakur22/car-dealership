from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
)
from app.models import User
from app.schemas import (
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import (
    authenticate_user,
    create_user,
)


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


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
def login(
    credentials: UserLogin,
    database_session: Session = Depends(get_db),
) -> TokenResponse:
    try:
        access_token = authenticate_user(
            database_session=database_session,
            email=str(credentials.email),
            password=credentials.password,
        )
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    return TokenResponse(access_token=access_token)