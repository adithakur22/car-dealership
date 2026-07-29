from fastapi.testclient import TestClient as FastAPITestClient
import base64
import json

from app.models import User, UserRole
from app.security import hash_password


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
def test_login_returns_access_token(
    client: FastAPITestClient,
):
    registration_data = {
        "email": "loginuser@example.com",
        "password": "StrongPassword123!",
    }

    registration_response = client.post(
        "/api/auth/register",
        json=registration_data,
    )

    assert registration_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json=registration_data,
    )

    assert login_response.status_code == 200

    response_body = login_response.json()

    assert isinstance(response_body["access_token"], str)
    assert response_body["access_token"]
    assert response_body["token_type"] == "bearer"
def test_login_rejects_incorrect_password(
    client: FastAPITestClient,
):
    client.post(
        "/api/auth/register",
        json={
            "email": "wrongpassword@example.com",
            "password": "CorrectPassword123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrongpassword@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid email or password"
    }
    assert response.headers["www-authenticate"] == "Bearer"


def test_login_rejects_unknown_user(
    client: FastAPITestClient,
):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid email or password"
    }
    assert response.headers["www-authenticate"] == "Bearer"
    
def test_admin_login_token_contains_admin_role(
    client,
    database_session,
):
    admin = User(
        email="jwt-admin@example.com",
        password_hash=hash_password("AdminPass123!"),
        role=UserRole.ADMIN,
    )

    database_session.add(admin)
    database_session.commit()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "jwt-admin@example.com",
            "password": "AdminPass123!",
        },
    )

    assert response.status_code == 200

    access_token = response.json()["access_token"]
    encoded_payload = access_token.split(".")[1]
    padded_payload = encoded_payload + "=" * (
        -len(encoded_payload) % 4
    )

    payload = json.loads(
        base64.urlsafe_b64decode(padded_payload).decode("utf-8")
    )

    assert payload["role"] == UserRole.ADMIN.value