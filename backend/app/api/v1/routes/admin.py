from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import require_admin
from app.db.session import get_session
from app.models.category import VocabularyCategory
from app.models.translation import WordTranslation
from app.models.word import VocabularyWord
from app.schemas.admin import CategoryIn, CategoryOut, WordIn

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])


@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(session: AsyncSession = Depends(get_session)) -> list[VocabularyCategory]:
    result = await session.execute(select(VocabularyCategory))
    return list(result.scalars().all())


@router.post("/categories", response_model=CategoryOut, status_code=201)
async def create_category(
    payload: CategoryIn, session: AsyncSession = Depends(get_session)
) -> VocabularyCategory:
    category = VocabularyCategory(name=payload.name, icon_emoji=payload.icon_emoji)
    session.add(category)
    await session.commit()
    await session.refresh(category)
    return category


@router.post("/words", status_code=201)
async def create_word(payload: WordIn, session: AsyncSession = Depends(get_session)) -> dict[str, int]:
    word = VocabularyWord(
        category_id=payload.category_id,
        original_en=payload.original_en,
        emoji=payload.emoji,
        image_url=payload.image_url,
        expected_confidence=payload.expected_confidence,
        example_sentence_en=payload.example_sentence_en,
    )
    session.add(word)
    await session.flush()

    for translation in payload.translations:
        session.add(
            WordTranslation(
                word_id=word.id,
                language_code=translation.language_code,
                translated_text=translation.translated_text,
                example_sentence_translated=translation.example_sentence_translated,
            )
        )

    await session.commit()
    return {"id": word.id}


@router.put("/words/{word_id}", status_code=200)
async def update_word(
    word_id: int, payload: WordIn, session: AsyncSession = Depends(get_session)
) -> dict[str, int]:
    result = await session.execute(
        select(VocabularyWord)
        .where(VocabularyWord.id == word_id)
        .options(selectinload(VocabularyWord.translations))
    )
    word = result.scalar_one_or_none()
    if word is None:
        raise HTTPException(status_code=404, detail="Palavra não encontrada.")

    word.category_id = payload.category_id
    word.original_en = payload.original_en
    word.emoji = payload.emoji
    word.image_url = payload.image_url
    word.expected_confidence = payload.expected_confidence
    word.example_sentence_en = payload.example_sentence_en

    for translation in list(word.translations):
        await session.delete(translation)
    await session.flush()

    for translation in payload.translations:
        session.add(
            WordTranslation(
                word_id=word.id,
                language_code=translation.language_code,
                translated_text=translation.translated_text,
                example_sentence_translated=translation.example_sentence_translated,
            )
        )

    await session.commit()
    return {"id": word.id}


@router.delete("/words/{word_id}", status_code=204)
async def delete_word(word_id: int, session: AsyncSession = Depends(get_session)) -> None:
    result = await session.execute(select(VocabularyWord).where(VocabularyWord.id == word_id))
    word = result.scalar_one_or_none()
    if word is None:
        raise HTTPException(status_code=404, detail="Palavra não encontrada.")
    await session.delete(word)
    await session.commit()
