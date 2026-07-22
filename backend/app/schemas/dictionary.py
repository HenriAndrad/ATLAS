from pydantic import BaseModel, ConfigDict


class DictionaryEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_text: str
    translated_text: str
    language_code: str
