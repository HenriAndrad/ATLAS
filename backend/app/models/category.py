from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class VocabularyCategory(Base):
    __tablename__ = "vocabulary_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)
    icon_emoji: Mapped[str] = mapped_column(default="📁")

    words: Mapped[list["VocabularyWord"]] = relationship(
        back_populates="category", cascade="all, delete-orphan"
    )
