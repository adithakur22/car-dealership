from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from decimal import Decimal

from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models import User, Vehicle
from app.schemas import (
    RestockRequest,
    VehicleCreate,
    VehicleResponse,
)
from app.services.vehicle_service import (
    create_vehicle,
    delete_existing_vehicle,
    find_vehicles,
    get_all_vehicles,
    restock_existing_vehicle,
    update_existing_vehicle,
    purchase_existing_vehicle,
)

from app.exceptions import (
    VehicleNotFoundError,
    VehicleOutOfStockError,
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
    
@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
)
def update_vehicle(
    vehicle_id: UUID,
    vehicle_data: VehicleCreate,
    database_session: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> Vehicle:
    try:
        return update_existing_vehicle(
            database_session=database_session,
            vehicle_id=vehicle_id,
            make=vehicle_data.make,
            model=vehicle_data.model,
            category=vehicle_data.category,
            price=vehicle_data.price,
            quantity=vehicle_data.quantity,
        )
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
        
@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_vehicle(
    vehicle_id: UUID,
    database_session: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> Response:
    try:
        delete_existing_vehicle(
            database_session=database_session,
            vehicle_id=vehicle_id,
        )
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )
    
@router.post(
    "/{vehicle_id}/purchase",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
)
def purchase_vehicle(
    vehicle_id: UUID,
    database_session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Vehicle:
    try:
        return purchase_existing_vehicle(
            database_session=database_session,
            vehicle_id=vehicle_id,
        )
    except VehicleOutOfStockError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
        
@router.post(
    "/{vehicle_id}/restock",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
)
def restock_vehicle(
    vehicle_id: UUID,
    restock_data: RestockRequest,
    database_session: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> Vehicle:
    try:
        return restock_existing_vehicle(
            database_session=database_session,
            vehicle_id=vehicle_id,
            quantity=restock_data.quantity,
        )
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error