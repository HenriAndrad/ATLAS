import type { SupportedLanguage } from "../../core/constants/appConstants";

export type VideoType = "upload" | "youtube";

/// Espelha o formato retornado por GET /api/v1/videos.
export interface VideoContent {
  id: number;
  title: string;
  video_url: string;
  video_type: VideoType;
  category: string;
  language_code: SupportedLanguage;
}
