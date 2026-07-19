from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.video import VideoContent
from app.schemas.video import VideoOut

router = APIRouter()


@router.get("/videos", response_model=list[VideoOut])
async def list_videos(session: AsyncSession = Depends(get_session)) -> list[VideoContent]:
    result = await session.execute(select(VideoContent))
    return list(result.scalars().all())
