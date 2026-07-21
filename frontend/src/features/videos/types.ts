import type { SupportedLanguage } from "../../core/constants/appConstants";

/// Espelha o formato retornado por GET /api/v1/videos.
export interface VideoContent {
  id: number;
  title: string;
  video_url: string;
  category: string;
  language_code: SupportedLanguage;
}
