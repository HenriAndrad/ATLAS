from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def _normalize_database_url(raw_url: str) -> str:
    """Corrige erros comuns de connection string antes de criar o engine.

    - `asyncpg` não aceita o parâmetro `sslmode` (usado por psycopg2/libpq,
      é o que a maioria dos provedores de Postgres, incluindo o Supabase,
      mostra por padrão) — precisa ser `ssl` em vez disso.
    - Garante que o driver seja `+asyncpg`, caso alguém cole a URL "crua".
    """
    url = raw_url.strip()

    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)

    url = (
        url.replace("sslmode=require", "ssl=require")
        .replace("sslmode=prefer", "ssl=prefer")
        .replace("sslmode=verify-full", "ssl=require")
        .replace("sslmode=disable", "ssl=disable")
    )

    return url


engine = (
    create_async_engine(_normalize_database_url(settings.database_url), echo=False)
    if settings.database_url
    else None
)
async_session = async_sessionmaker(engine, expire_on_commit=False) if engine else None


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    if async_session is None:
        raise RuntimeError(
            "DATABASE_URL não configurada. Defina-a no .env para usar a Biblioteca."
        )
    async with async_session() as session:
        yield session
