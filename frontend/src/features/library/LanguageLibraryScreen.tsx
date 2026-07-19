import { useEffect, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLibrary } from "./libraryApi";
import type { LibraryCategory } from "./types";
import { speakText } from "../tts/speakText";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  type SupportedLanguage,
} from "../../core/constants/appConstants";

const LANGUAGE_NAMES: Record<string, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  de: "Alemão",
  fr: "Francês",
  ht: "Crioulo Haitiano",
};

/// Mostra o vocabulário de um idioma (rota /biblioteca/:lang), agrupado
/// por categoria. Uma palavra só aparece se já tiver tradução cadastrada
/// para o idioma escolhido — palavras sem tradução ainda ficam ocultas
/// em vez de mostrar algo incompleto.
export function LanguageLibraryScreen() {
  const { lang } = useParams<{ lang: string }>();
  const [categories, setCategories] = useState<LibraryCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLibrary()
      .then(setCategories)
      .catch(() => setError("Não foi possível carregar o conteúdo agora."));
  }, []);

  const languageName = lang ? LANGUAGE_NAMES[lang] ?? lang : "";

  const categoriesWithContent = (categories ?? [])
    .map((category) => ({
      ...category,
      words: category.words
        .map((word) => ({
          word,
          translation: word.translations.find((t) => t.language_code === lang),
        }))
        .filter((entry): entry is { word: typeof entry.word; translation: NonNullable<typeof entry.translation> } =>
          Boolean(entry.translation),
        ),
    }))
    .filter((category) => category.words.length > 0);

  return (
    <div style={containerStyle}>
      <Link to="/biblioteca" style={backLinkStyle}>
        ← Biblioteca
      </Link>
      <h1 style={titleStyle}>{languageName}</h1>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && categories === null && <p style={messageStyle}>Carregando...</p>}

      {categories !== null && categoriesWithContent.length === 0 && !error && (
        <p style={messageStyle}>
          Ainda não há conteúdo cadastrado neste idioma — novidades em breve.
        </p>
      )}

      {categoriesWithContent.map((category) => (
        <section key={category.id} style={categoryStyle}>
          <h2 style={categoryTitleStyle}>
            {category.icon_emoji} {category.name}
          </h2>
          <div style={wordsGridStyle}>
            {category.words.map(({ word, translation }) => (
              <button
                key={word.id}
                style={wordCardStyle}
                onClick={() => speakText(translation.translated_text, lang as SupportedLanguage)}
              >
                <span style={wordEmojiStyle}>{word.emoji ?? "🔤"}</span>
                <span style={wordOriginalStyle}>{word.original_en}</span>
                <span style={wordTranslatedStyle}>→ {translation.translated_text}</span>
                <span style={wordSpeakerStyle}>🔊</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: 20,
  paddingBottom: 96,
  color: COLOR_TEXT_PRIMARY,
  fontFamily: "system-ui, sans-serif",
  height: "100%",
  overflowY: "auto",
  background: COLOR_BACKGROUND,
};

const backLinkStyle: CSSProperties = {
  color: ACCENT_COLOR,
  fontSize: 13,
  textDecoration: "none",
};

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: "8px 0 20px" };

const messageStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 14,
  marginTop: 24,
};

const categoryStyle: CSSProperties = { marginBottom: 24 };
const categoryTitleStyle: CSSProperties = { fontSize: 16, fontWeight: 700, marginBottom: 10 };

const wordsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 10,
};

const wordCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 4,
  padding: 12,
  borderRadius: 12,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  color: COLOR_TEXT_PRIMARY,
  textAlign: "left",
  cursor: "pointer",
  position: "relative",
};

const wordEmojiStyle: CSSProperties = { fontSize: 24 };
const wordOriginalStyle: CSSProperties = { fontSize: 12, color: COLOR_TEXT_SECONDARY };
const wordTranslatedStyle: CSSProperties = { fontSize: 14, fontWeight: 600 };
const wordSpeakerStyle: CSSProperties = { position: "absolute", top: 10, right: 10, fontSize: 14 };
