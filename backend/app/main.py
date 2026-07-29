from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.health import router as health_router
from app.routers.vehicles import router as vehicles_router

from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI(
    title="Car Dealership Inventory API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(vehicles_router)