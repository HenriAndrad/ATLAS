from pydantic import BaseModel, ConfigDict


class TranslationIn(BaseModel):
    language_code: str
    translated_text: str
    example_sentence_translated: str | None = None


class WordIn(BaseModel):
    category_id: int
    original_en: str
    emoji: str | None = None
    image_url: str | None = None
    expected_confidence: float = 0.5
    example_sentence_en: str | None = None
    translations: list[TranslationIn] = []


class CategoryIn(BaseModel):
    name: str
    icon_emoji: str = "📁"


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon_emoji: str
