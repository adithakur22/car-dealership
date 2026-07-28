from getpass import getpass

from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy import select

from app.database import SessionLocal
from app.models import User, UserRole
from app.security import hash_password


email_validator = TypeAdapter(EmailStr)


def main() -> None:
    email_input = input("Admin email: ").strip()

    try:
        email = str(
            email_validator.validate_python(email_input)
        ).lower()
    except ValidationError:
        print("Invalid email address.")
        raise SystemExit(1)

    password = getpass("Admin password: ")

    if len(password) < 8:
        print("Password must contain at least 8 characters.")
        raise SystemExit(1)

    with SessionLocal() as database_session:
        user = database_session.scalar(
            select(User).where(User.email == email)
        )

        if user is None:
            user = User(
                email=email,
                password_hash=hash_password(password),
                role=UserRole.ADMIN,
            )
            database_session.add(user)
            message = "Admin user created."
        else:
            user.role = UserRole.ADMIN
            user.password_hash = hash_password(password)
            message = "Existing user promoted to admin."

        database_session.commit()

    print(message)


if __name__ == "__main__":
    main()