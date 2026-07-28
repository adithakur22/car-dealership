from fastapi.testclient import TestClient


def test_register_user_successfully(client: TestClient):
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