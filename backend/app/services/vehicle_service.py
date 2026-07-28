from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Vehicle
from uuid import UUID


def create_vehicle(
    database_session: Session,
    make: str,
    model: str,
    category: str,
    price: Decimal,
    quantity: int,
) -> Vehicle:
    vehicle = Vehicle(
        make=make,
        model=model,
        category=category,
        price=price,
        quantity=quantity,
    )

    database_session.add(vehicle)
    database_session.commit()
    database_session.refresh(vehicle)

    return vehicle


def get_all_vehicles(
    database_session: Session,
) -> list[Vehicle]:
    statement = select(Vehicle).order_by(
        Vehicle.created_at.desc()
    )

    return list(
        database_session.scalars(statement).all()
    )
    
def find_vehicles(
    database_session: Session,
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
) -> list[Vehicle]:
    statement = select(Vehicle)

    if make:
        statement = statement.where(
            Vehicle.make.ilike(f"%{make.strip()}%")
        )

    if model:
        statement = statement.where(
            Vehicle.model.ilike(f"%{model.strip()}%")
        )

    if category:
        statement = statement.where(
            Vehicle.category.ilike(
                f"%{category.strip()}%"
            )
        )

    if min_price is not None:
        statement = statement.where(
            Vehicle.price >= min_price
        )

    if max_price is not None:
        statement = statement.where(
            Vehicle.price <= max_price
        )

    statement = statement.order_by(
        Vehicle.created_at.desc()
    )

    return list(
        database_session.scalars(statement).all()
    )
    return list(
        database_session.scalars(statement).all()
    )
def update_existing_vehicle(
    database_session: Session,
    vehicle_id: UUID,
    make: str,
    model: str,
    category: str,
    price: Decimal,
    quantity: int,
) -> Vehicle | None:
    vehicle = database_session.get(Vehicle, vehicle_id)

    if vehicle is None:
        return None

    vehicle.make = make
    vehicle.model = model
    vehicle.category = category
    vehicle.price = price
    vehicle.quantity = quantity

    database_session.commit()
    database_session.refresh(vehicle)

    return vehicle