from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models import User


router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)


@router.get("")
def list_vehicles(
    current_user: User = Depends(get_current_user),
) -> list[dict[str, object]]:
    return []