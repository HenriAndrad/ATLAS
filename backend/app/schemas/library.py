from pydantic import BaseModel, ConfigDict


class TranslationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    language_code: str
    translated_text: str
    example_sentence_translated: str | None = None


class WordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_en: str
    emoji: str | None
    image_url: str | None
    expected_confidence: float
    example_sentence_en: str | None
    translations: list[TranslationOut]


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon_emoji: str
    words: list[WordOut]
