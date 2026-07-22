from pydantic import BaseModel, Field


class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    target_lang: str
    source_lang: str | None = None


class TranslationResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str
