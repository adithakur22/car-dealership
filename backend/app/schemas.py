from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import UserRole

from decimal import Decimal


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: UserRole

    model_config = ConfigDict(from_attributes=True)
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class VehicleCreate(BaseModel):
    make: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    price: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )
    quantity: int = Field(ge=0)


class VehicleResponse(BaseModel):
    id: UUID
    make: str
    model: str
    category: str
    price: Decimal
    quantity: int

    model_config = ConfigDict(from_attributes=True)
    
class RestockRequest(BaseModel):
    quantity: int = Field(gt=0)