from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_session
from app.models.category import VocabularyCategory
from app.models.word import VocabularyWord
from app.schemas.library import CategoryOut

router = APIRouter()


@router.get("/library", response_model=list[CategoryOut])
async def get_library(session: AsyncSession = Depends(get_session)) -> list[VocabularyCategory]:
    """Retorna todas as categorias, palavras e traduções cadastradas.

    O filtro por idioma é feito no frontend — o volume de dados é
    pequeno o suficiente para não precisar de um endpoint por idioma.
    """
    result = await session.execute(
        select(VocabularyCategory).options(
            selectinload(VocabularyCategory.words).selectinload(VocabularyWord.translations)
        )
    )
    return list(result.scalars().unique().all())
