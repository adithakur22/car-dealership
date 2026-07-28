from decimal import Decimal

from sqlalchemy.orm import Session

from app.models import Vehicle


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