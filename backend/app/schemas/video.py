from pydantic import BaseModel, ConfigDict


class VideoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    youtube_video_id: str
    title: str
    thumbnail_url: str | None
    category: str
    language_code: str


class VideoCreate(BaseModel):
    youtube_url: str
    category: str
    language_code: str
