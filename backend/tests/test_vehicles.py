from fastapi.testclient import TestClient as FastAPITestClient
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt

from app.config import settings
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import User, UserRole


def create_authentication_headers(
    client: FastAPITestClient,
) -> dict[str, str]:
    credentials = {
        "email": "vehicleuser@example.com",
        "password": "StrongPassword123!",
    }

    registration_response = client.post(
        "/api/auth/register",
        json=credentials,
    )
    assert registration_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json=credentials,
    )
    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {access_token}",
    }


def test_vehicle_list_requires_authentication(
    client: FastAPITestClient,
):
    response = client.get("/api/vehicles")

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Not authenticated"
    }
    assert response.headers["www-authenticate"] == "Bearer"


def test_authenticated_user_can_view_empty_inventory(
    client: FastAPITestClient,
):
    authentication_headers = create_authentication_headers(client)

    response = client.get(
        "/api/vehicles",
        headers=authentication_headers,
    )

    assert response.status_code == 200
    assert response.json() == []
def test_vehicle_list_rejects_malformed_token(
    client: FastAPITestClient,
):
    response = client.get(
        "/api/vehicles",
        headers={
            "Authorization": "Bearer this-is-not-a-valid-token"
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Not authenticated"
    }
    assert response.headers["www-authenticate"] == "Bearer"


def test_vehicle_list_rejects_expired_token(
    client: FastAPITestClient,
):
    expired_token = jwt.encode(
        {
            "sub": str(uuid4()),
            "exp": datetime.now(timezone.utc)
            - timedelta(minutes=1),
        },
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    response = client.get(
        "/api/vehicles",
        headers={
            "Authorization": f"Bearer {expired_token}"
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Not authenticated"
    }
    assert response.headers["www-authenticate"] == "Bearer"
def create_admin_authentication_headers(
    client: FastAPITestClient,
    database_session: Session,
) -> dict[str, str]:
    credentials = {
        "email": "admin@example.com",
        "password": "StrongPassword123!",
    }

    registration_response = client.post(
        "/api/auth/register",
        json=credentials,
    )
    assert registration_response.status_code == 201

    admin_user = database_session.scalar(
        select(User).where(User.email == credentials["email"])
    )
    assert admin_user is not None

    admin_user.role = UserRole.ADMIN
    database_session.commit()

    login_response = client.post(
        "/api/auth/login",
        json=credentials,
    )
    assert login_response.status_code == 200

    return {
        "Authorization": (
            f"Bearer {login_response.json()['access_token']}"
        )
    }
def test_regular_user_cannot_add_vehicle(
    client: FastAPITestClient,
):
    headers = create_authentication_headers(client)

    response = client.post(
        "/api/vehicles",
        headers=headers,
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": "45000.00",
            "quantity": 3,
        },
    )

    assert response.status_code == 403
    assert response.json() == {
        "detail": "Admin access required"
    }


def test_admin_can_add_vehicle(
    client: FastAPITestClient,
    database_session: Session,
):
    headers = create_admin_authentication_headers(
        client,
        database_session,
    )

    response = client.post(
        "/api/vehicles",
        headers=headers,
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": "45000.00",
            "quantity": 3,
        },
    )

    assert response.status_code == 201

    response_body = response.json()

    assert "id" in response_body
    assert response_body["make"] == "Toyota"
    assert response_body["model"] == "Fortuner"
    assert response_body["category"] == "SUV"
    assert Decimal(str(response_body["price"])) == Decimal(
        "45000.00"
    )
    assert response_body["quantity"] == 3
def test_authenticated_user_can_view_persisted_vehicles(
    client: FastAPITestClient,
    database_session: Session,
):
    admin_headers = create_admin_authentication_headers(
        client,
        database_session,
    )

    creation_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": "25000.00",
            "quantity": 4,
        },
    )

    assert creation_response.status_code == 201

    user_headers = create_authentication_headers(client)

    list_response = client.get(
        "/api/vehicles",
        headers=user_headers,
    )

    assert list_response.status_code == 200

    vehicles = list_response.json()

    assert len(vehicles) == 1
    assert vehicles[0]["make"] == "Honda"
    assert vehicles[0]["model"] == "Civic"
    assert vehicles[0]["category"] == "Sedan"
    assert Decimal(str(vehicles[0]["price"])) == Decimal(
        "25000.00"
    )
    assert vehicles[0]["quantity"] == 4
    
def test_search_vehicles_by_make_case_insensitively(
    client: FastAPITestClient,
    database_session: Session,
):
    admin_headers = create_admin_authentication_headers(
        client,
        database_session,
    )

    toyota_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": "45000.00",
            "quantity": 3,
        },
    )
    assert toyota_response.status_code == 201

    honda_response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": "25000.00",
            "quantity": 4,
        },
    )
    assert honda_response.status_code == 201

    user_headers = create_authentication_headers(client)

    response = client.get(
        "/api/vehicles/search?make=toyota",
        headers=user_headers,
    )

    assert response.status_code == 200

    vehicles = response.json()

    assert len(vehicles) == 1
    assert vehicles[0]["make"] == "Toyota"
    assert vehicles[0]["model"] == "Fortuner"