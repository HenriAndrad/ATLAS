from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

engine = create_async_engine(settings.database_url, echo=False) if settings.database_url else None
async_session = async_sessionmaker(engine, expire_on_commit=False) if engine else None


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    if async_session is None:
        raise RuntimeError(
            "DATABASE_URL não configurada. Defina-a no .env para usar a Biblioteca."
        )
    async with async_session() as session:
        yield session
