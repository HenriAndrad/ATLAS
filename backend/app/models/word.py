from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class VocabularyWord(Base):
    __tablename__ = "vocabulary_words"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("vocabulary_categories.id"))
    original_en: Mapped[str]
    emoji: Mapped[str | None] = mapped_column(default=None)
    image_url: Mapped[str | None] = mapped_column(default=None)
    expected_confidence: Mapped[float] = mapped_column(default=0.5)
    example_sentence_en: Mapped[str | None] = mapped_column(default=None)

    category: Mapped["VocabularyCategory"] = relationship(back_populates="words")
    translations: Mapped[list["WordTranslation"]] = relationship(
        back_populates="word", cascade="all, delete-orphan"
    )
