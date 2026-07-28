from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from decimal import Decimal

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models import User, Vehicle
from app.schemas import VehicleCreate, VehicleResponse
from app.services.vehicle_service import (
    create_vehicle,
    find_vehicles,
    get_all_vehicles,
)


router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)

@router.get(
    "/search",
    response_model=list[VehicleResponse],
)
def search_vehicles(
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: Decimal | None = Query(
        default=None,
        ge=0,
    ),
    max_price: Decimal | None = Query(
        default=None,
        ge=0,
    ),
    database_session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Vehicle]:
    return find_vehicles(
        database_session=database_session,
        make=make,
        model=model,
        category=category,
        min_price=min_price,
        max_price=max_price,
    )

@router.get(
    "",
    response_model=list[VehicleResponse],
)
def list_vehicles(
    database_session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Vehicle]:
    return get_all_vehicles(database_session)


@router.post(
    "",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_vehicle(
    vehicle_data: VehicleCreate,
    database_session: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> Vehicle:
    return create_vehicle(
        database_session=database_session,
        make=vehicle_data.make,
        model=vehicle_data.model,
        category=vehicle_data.category,
        price=vehicle_data.price,
        quantity=vehicle_data.quantity,
    )