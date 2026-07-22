from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class WordTranslation(Base):
    __tablename__ = "word_translations"

    id: Mapped[int] = mapped_column(primary_key=True)
    word_id: Mapped[int] = mapped_column(ForeignKey("vocabulary_words.id"))
    language_code: Mapped[str]
    translated_text: Mapped[str]
    example_sentence_translated: Mapped[str | None] = mapped_column(default=None)

    word: Mapped["VocabularyWord"] = relationship(back_populates="translations")
