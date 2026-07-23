from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class VideoContent(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    video_url: Mapped[str]
    video_type: Mapped[str] = mapped_column(default="upload")  # "upload" ou "youtube"
    category: Mapped[str]
    language_code: Mapped[str]
