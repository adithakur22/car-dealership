from fastapi.testclient import TestClient as FastAPITestClient


def test_register_user_successfully(client: FastAPITestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 201

    response_body = response.json()

    assert "id" in response_body
    assert response_body["email"] == "newuser@example.com"
    assert response_body["role"] == "USER"
    assert "password" not in response_body
    assert "password_hash" not in response_body
    
def test_registration_rejects_duplicate_email(
    client: FastAPITestClient,
):
    registration_data = {
        "email": "duplicate@example.com",
        "password": "StrongPassword123!",
    }

    first_response = client.post(
        "/api/auth/register",
        json=registration_data,
    )

    second_response = client.post(
        "/api/auth/register",
        json=registration_data,
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409
    assert second_response.json() == {
        "detail": "Email already registered"
    }