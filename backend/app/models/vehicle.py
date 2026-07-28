from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Integer,
    Numeric,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    __table_args__ = (
        CheckConstraint(
            "price > 0",
            name="ck_vehicles_price_positive",
        ),
        CheckConstraint(
            "quantity >= 0",
            name="ck_vehicles_quantity_nonnegative",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4,
    )

    make: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
    )

    model: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        index=True,
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )