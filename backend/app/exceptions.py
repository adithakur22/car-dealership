class EmailAlreadyRegisteredError(Exception):
    def __init__(self) -> None:
        super().__init__("Email already registered")


class InvalidCredentialsError(Exception):
    def __init__(self) -> None:
        super().__init__("Invalid email or password")
        
class VehicleNotFoundError(Exception):
    def __init__(self) -> None:
        super().__init__("Vehicle not found")