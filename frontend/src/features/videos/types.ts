import type { SupportedLanguage } from "../../core/constants/appConstants";

/// Espelha o formato retornado por GET /api/v1/videos.
export interface VideoContent {
  id: number;
  youtube_video_id: string;
  title: string;
  thumbnail_url: string | null;
  category: string;
  language_code: SupportedLanguage;
}
