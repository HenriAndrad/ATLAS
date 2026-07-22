from fastapi import APIRouter

from app.api.v1.routes import admin, auth, dictionary, health, library, translate, videos

router = APIRouter(prefix="/api/v1")
router.include_router(health.router)
router.include_router(auth.router)
router.include_router(translate.router)
router.include_router(library.router)
router.include_router(videos.router)
router.include_router(dictionary.router)
router.include_router(admin.router)
