from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class VideoContent(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    youtube_video_id: Mapped[str]
    title: Mapped[str]
    thumbnail_url: Mapped[str | None] = mapped_column(default=None)
    category: Mapped[str]
    language_code: Mapped[str]
