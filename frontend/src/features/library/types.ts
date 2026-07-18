/// Tipos que espelham exatamente o formato retornado por GET /api/v1/library.

export interface WordTranslation {
  language_code: string;
  translated_text: string;
  example_sentence_translated: string | null;
}

export interface LibraryWord {
  id: number;
  original_en: string;
  emoji: string | null;
  image_url: string | null;
  expected_confidence: number;
  example_sentence_en: string | null;
  translations: WordTranslation[];
}

export interface LibraryCategory {
  id: number;
  name: string;
  icon_emoji: string;
  words: LibraryWord[];
}
