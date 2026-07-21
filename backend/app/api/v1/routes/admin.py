from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import require_admin_user
from app.db.session import get_session
from app.models.category import VocabularyCategory
from app.models.dictionary_entry import DictionaryEntry
from app.models.translation import WordTranslation
from app.models.video import VideoContent
from app.models.word import VocabularyWord
from app.schemas.admin import CategoryIn, CategoryOut, WordIn
from app.schemas.dictionary import DictionaryEntryOut
from app.schemas.video import VideoOut
from app.services.document_parser import DocumentParseError, parse_word_pairs
from app.services.storage_service import StorageError, upload_video

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin_user)])


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


# ---------------------------------------------------------------------------
# Vídeos
# ---------------------------------------------------------------------------


@router.get("/videos", response_model=list[VideoOut])
async def list_admin_videos(session: AsyncSession = Depends(get_session)) -> list[VideoContent]:
    result = await session.execute(select(VideoContent))
    return list(result.scalars().all())


@router.post("/videos", response_model=VideoOut, status_code=201)
async def create_video(
    title: str = Form(...),
    category: str = Form(...),
    language_code: str = Form(...),
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
) -> VideoContent:
    content = await file.read()

    try:
        video_url = await upload_video(
            content=content,
            filename=file.filename or "video.mp4",
            content_type=file.content_type or "video/mp4",
        )
    except StorageError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    video = VideoContent(
        title=title.strip(),
        video_url=video_url,
        category=category.strip(),
        language_code=language_code.lower(),
    )
    session.add(video)
    await session.commit()
    await session.refresh(video)
    return video


@router.delete("/videos/{video_id}", status_code=204)
async def delete_video(video_id: int, session: AsyncSession = Depends(get_session)) -> None:
    result = await session.execute(select(VideoContent).where(VideoContent.id == video_id))
    video = result.scalar_one_or_none()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado.")
    await session.delete(video)
    await session.commit()


# ---------------------------------------------------------------------------
# Dicionário (upload de documento)
# ---------------------------------------------------------------------------


@router.post("/dictionary/upload", response_model=list[DictionaryEntryOut], status_code=201)
async def upload_dictionary_document(
    language_code: str = Form(...),
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
) -> list[DictionaryEntry]:
    content = await file.read()

    try:
        pairs = parse_word_pairs(content, file.filename or "")
    except DocumentParseError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    normalized_language = language_code.lower()

    # Substitui o dicionário existente desse idioma pelo novo envio —
    # evita duplicar palavras a cada novo upload do mesmo documento.
    await session.execute(
        delete(DictionaryEntry).where(DictionaryEntry.language_code == normalized_language)
    )

    entries = [
        DictionaryEntry(original_text=original, translated_text=translated, language_code=normalized_language)
        for original, translated in pairs
    ]
    session.add_all(entries)
    await session.commit()

    for entry in entries:
        await session.refresh(entry)

    return entries


@router.delete("/dictionary/{entry_id}", status_code=204)
async def delete_dictionary_entry(entry_id: int, session: AsyncSession = Depends(get_session)) -> None:
    result = await session.execute(select(DictionaryEntry).where(DictionaryEntry.id == entry_id))
    entry = result.scalar_one_or_none()
    if entry is None:
        raise HTTPException(status_code=404, detail="Entrada não encontrada.")
    await session.delete(entry)
    await session.commit()
