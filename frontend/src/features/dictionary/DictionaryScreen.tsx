import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Search as SearchIcon, Volume2 } from "lucide-react";
import { fetchLibrary } from "../library/libraryApi";
import type { LibraryCategory } from "../library/types";
import { useLanguageContext } from "../../core/context/LanguageContext";
import { useTranslation } from "../../core/i18n/useTranslation";
import { speakText } from "../tts/speakText";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from "../../core/constants/appConstants";

interface DictionaryEntry {
  id: number;
  emoji: string | null;
  original: string;
  translated: string;
  categoryName: string;
}

/// Aba "Dicionário": mostra as palavras cadastradas no banco (o mesmo
/// da Biblioteca) que já têm tradução para o idioma escolhido pelo
/// usuário em Idiomas — funciona como uma lista de "palavras mais
/// comuns" nesse idioma, pesquisável por nome original ou traduzido.
export function DictionaryScreen() {
  const { targetLanguage } = useLanguageContext();
  const t = useTranslation();

  const [categories, setCategories] = useState<LibraryCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLibrary()
      .then(setCategories)
      .catch(() => setError("Não foi possível carregar o dicionário agora."));
  }, []);

  const entries: DictionaryEntry[] = useMemo(() => {
    if (!categories) return [];

    return categories.flatMap((category) =>
      category.words
        .map((word) => {
          const translation = word.translations.find((tr) => tr.language_code === targetLanguage);
          if (!translation) return null;
          return {
            id: word.id,
            emoji: word.emoji,
            original: word.original_en,
            translated: translation.translated_text,
            categoryName: category.name,
          };
        })
        .filter((entry): entry is DictionaryEntry => entry !== null),
    );
  }, [categories, targetLanguage]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(
      (entry) =>
        entry.original.toLowerCase().includes(query) ||
        entry.translated.toLowerCase().includes(query),
    );
  }, [entries, search]);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t("dictionary.title")}</h1>
      <p style={subtitleStyle}>{t("dictionary.subtitle")}</p>

      <div style={searchBoxStyle}>
        <SearchIcon size={16} color={COLOR_TEXT_SECONDARY} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("dictionary.search")}
          style={searchInputStyle}
        />
      </div>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && categories === null && <p style={messageStyle}>...</p>}

      {categories !== null && filteredEntries.length === 0 && !error && (
        <p style={messageStyle}>{t("dictionary.empty")}</p>
      )}

      <div style={listStyle}>
        {filteredEntries.map((entry) => (
          <button
            key={entry.id}
            style={itemStyle}
            onClick={() => speakText(entry.translated, targetLanguage)}
          >
            <span style={emojiStyle}>{entry.emoji ?? "🔤"}</span>
            <span style={textColumnStyle}>
              <span style={translatedStyle}>{entry.translated}</span>
              <span style={originalStyle}>
                {entry.original} • {entry.categoryName}
              </span>
            </span>
            <Volume2 size={16} color={ACCENT_COLOR} />
          </button>
        ))}
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  height: "100%",
  overflowY: "auto",
  padding: 20,
  paddingBottom: 96,
  background: COLOR_BACKGROUND,
  fontFamily: "system-ui, sans-serif",
};

const titleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 22, fontWeight: 800, margin: 0 };
const subtitleStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  margin: "4px 0 16px",
};

const searchBoxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 14,
  background: COLOR_SURFACE,
  border: `1px solid ${COLOR_BORDER}`,
  marginBottom: 16,
};

const searchInputStyle: CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
};

const messageStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  textAlign: "center",
  marginTop: 24,
};

const listStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 12,
  borderRadius: 14,
  background: COLOR_SURFACE,
  border: `1px solid ${COLOR_BORDER}`,
  textAlign: "left",
  cursor: "pointer",
};

const emojiStyle: CSSProperties = { fontSize: 22 };
const textColumnStyle: CSSProperties = { display: "flex", flexDirection: "column", flex: 1 };
const translatedStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 14, fontWeight: 700 };
const originalStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 12 };
