import type { SupportedLanguage } from "../../core/constants/appConstants";

export type VideoCategory = "aula" | "dica" | "desafio" | "conteudo_educacional";

/// Um vídeo dentro do app. `youtubeVideoId` é o campo que a integração
/// futura com a API do YouTube vai preencher (hoje não é usado por
/// nenhum vídeo real, já que ainda não há conteúdo publicado).
export interface VideoContent {
  id: string;
  youtubeVideoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: VideoCategory;
  relatedLanguage: SupportedLanguage;
}
