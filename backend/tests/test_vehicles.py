from fastapi.testclient import TestClient as FastAPITestClient


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