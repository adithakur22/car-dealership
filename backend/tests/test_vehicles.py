from fastapi.testclient import TestClient as FastAPITestClient
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt

from app.config import settings


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