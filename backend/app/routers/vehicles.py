from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models import User, Vehicle
from app.schemas import VehicleCreate, VehicleResponse
from app.services.vehicle_service import (
    create_vehicle,
    get_all_vehicles,
)


router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
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