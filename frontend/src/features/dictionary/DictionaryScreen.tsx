import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Search as SearchIcon, Volume2 } from "lucide-react";
import { fetchLibrary } from "../library/libraryApi";
import type { LibraryCategory } from "../library/types";
import { fetchDictionaryEntries } from "./dictionaryApi";
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

interface DictionaryRow {
  id: string;
  emoji: string | null;
  original: string;
  translated: string;
  source: string | null;
}

/// Aba "Dicionário": combina duas fontes de palavras no idioma
/// escolhido pelo usuário — o banco curado da Biblioteca (com
/// emoji/categoria) e os documentos que o administrador importou
/// (palavra**tradução, sem categoria).
export function DictionaryScreen() {
  const { targetLanguage } = useLanguageContext();
  const t = useTranslation();

  const [libraryCategories, setLibraryCategories] = useState<LibraryCategory[] | null>(null);
  const [importedEntries, setImportedEntries] = useState<
    Awaited<ReturnType<typeof fetchDictionaryEntries>> | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLibraryCategories(null);
    setImportedEntries(null);
    Promise.all([fetchLibrary(), fetchDictionaryEntries(targetLanguage)])
      .then(([library, imported]) => {
        setLibraryCategories(library);
        setImportedEntries(imported);
      })
      .catch(() => setError("Não foi possível carregar o dicionário agora."));
  }, [targetLanguage]);

  const rows: DictionaryRow[] = useMemo(() => {
    const fromLibrary: DictionaryRow[] = (libraryCategories ?? []).flatMap((category) =>
      category.words
        .map((word): DictionaryRow | null => {
          const translation = word.translations.find((tr) => tr.language_code === targetLanguage);
          if (!translation) return null;
          return {
            id: `word-${word.id}`,
            emoji: word.emoji,
            original: word.original_en,
            translated: translation.translated_text,
            source: category.name,
          };
        })
        .filter((row): row is DictionaryRow => row !== null),
    );

    const fromImported: DictionaryRow[] = (importedEntries ?? []).map((entry) => ({
      id: `doc-${entry.id}`,
      emoji: null,
      original: entry.original_text,
      translated: entry.translated_text,
      source: null,
    }));

    return [...fromLibrary, ...fromImported];
  }, [libraryCategories, importedEntries, targetLanguage]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row.original.toLowerCase().includes(query) || row.translated.toLowerCase().includes(query),
    );
  }, [rows, search]);

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
      {!error && libraryCategories === null && <p style={messageStyle}>...</p>}

      {libraryCategories !== null && filteredRows.length === 0 && !error && (
        <p style={messageStyle}>{t("dictionary.empty")}</p>
      )}

      <div style={listStyle}>
        {filteredRows.map((row) => (
          <button
            key={row.id}
            style={itemStyle}
            onClick={() => speakText(row.translated, targetLanguage)}
          >
            <span style={emojiStyle}>{row.emoji ?? "🔤"}</span>
            <span style={textColumnStyle}>
              <span style={translatedStyle}>{row.translated}</span>
              <span style={originalStyle}>
                {row.original}
                {row.source ? ` • ${row.source}` : ""}
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
