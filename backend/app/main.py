from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.health import router as health_router
from app.routers.vehicles import router as vehicles_router


app = FastAPI(
    title="Car Dealership Inventory API",
    version="1.0.0",
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(vehicles_router)