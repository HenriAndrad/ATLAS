from fastapi import APIRouter

from app.api.v1.routes import admin, health, library, translate

router = APIRouter(prefix="/api/v1")
router.include_router(health.router)
router.include_router(translate.router)
router.include_router(library.router)
router.include_router(admin.router)
