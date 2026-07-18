from fastapi import APIRouter, HTTPException

from app.schemas.translation import TranslationRequest, TranslationResponse
from app.services.translation_service import TranslationError, translate_text

router = APIRouter()


@router.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest) -> TranslationResponse:
    try:
        translated = await translate_text(
            text=request.text,
            target_lang=request.target_lang,
            source_lang=request.source_lang,
        )
    except TranslationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return TranslationResponse(
        translated_text=translated,
        source_lang=request.source_lang or "auto",
        target_lang=request.target_lang,
    )
