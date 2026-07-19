from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DictionaryEntry(Base):
    __tablename__ = "dictionary_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    original_text: Mapped[str]
    translated_text: Mapped[str]
    language_code: Mapped[str]
