from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.dictionary_entry import DictionaryEntry
from app.schemas.dictionary import DictionaryEntryOut

router = APIRouter()


@router.get("/dictionary", response_model=list[DictionaryEntryOut])
async def list_dictionary_entries(
    language_code: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
) -> list[DictionaryEntry]:
    query = select(DictionaryEntry)
    if language_code:
        query = query.where(DictionaryEntry.language_code == language_code.lower())

    result = await session.execute(query)
    return list(result.scalars().all())
