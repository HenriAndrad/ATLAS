import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Search as SearchIcon, Volume2, Plus, X } from "lucide-react";
import { fetchLibrary } from "../library/libraryApi";
import type { LibraryCategory } from "../library/types";
import { fetchDictionaryEntries } from "./dictionaryApi";
import { uploadDictionaryDocument } from "../admin/adminApi";
import { useAuth } from "../../core/auth/AuthContext";
import { useLanguageContext } from "../../core/context/LanguageContext";
import { speakText } from "../tts/speakText";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
  SUPPORTED_LANGUAGES,
} from "../../core/constants/appConstants";

interface DictionaryRow {
  id: string;
  emoji: string | null;
  original: string;
  translated: string;
  source: string | null;
}

/// Aba "Dicionário": combina palavras da Biblioteca com as importadas
/// de documento pelo admin, no idioma escolhido. Admin vê um botão "+"
/// pra importar um novo documento .txt/.docx direto aqui.
export function DictionaryScreen() {
  const { user } = useAuth();
  const { targetLanguage } = useLanguageContext();

  const [libraryCategories, setLibraryCategories] = useState<LibraryCategory[] | null>(null);
  const [importedEntries, setImportedEntries] = useState<
    Awaited<ReturnType<typeof fetchDictionaryEntries>> | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function loadData() {
    try {
      const [library, imported] = await Promise.all([
        fetchLibrary(),
        fetchDictionaryEntries(targetLanguage),
      ]);
      setLibraryCategories(library);
      setImportedEntries(imported);
    } catch {
      setError("Não foi possível carregar o dicionário agora.");
    }
  }

  useEffect(() => {
    setLibraryCategories(null);
    setImportedEntries(null);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Dicionário</h1>
          <p style={subtitleStyle}>Palavras mais comuns no idioma escolhido</p>
        </div>
        {user?.is_admin && (
          <button onClick={() => setIsAdding(true)} style={addButtonStyle} aria-label="Importar documento">
            <Plus size={20} color="#fff" />
          </button>
        )}
      </div>

      <div style={searchBoxStyle}>
        <SearchIcon size={16} color={COLOR_TEXT_SECONDARY} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar palavra..."
          style={searchInputStyle}
        />
      </div>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && libraryCategories === null && <p style={messageStyle}>...</p>}

      {libraryCategories !== null && filteredRows.length === 0 && !error && (
        <p style={messageStyle}>Nenhuma palavra encontrada.</p>
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

      {isAdding && (
        <ImportDocumentModal
          onClose={() => setIsAdding(false)}
          onImported={() => {
            setIsAdding(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function ImportDocumentModal({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [languageCode, setLanguageCode] = useState<string>(SUPPORTED_LANGUAGES[0]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatusMessage(null);

    if (!file) {
      setStatusMessage("Escolha um arquivo .txt ou .docx.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { count } = await uploadDictionaryDocument(file, languageCode);
      setStatusMessage(`${count} palavra(s) importada(s).`);
      setTimeout(onImported, 800);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Falha ao importar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Importar dicionário</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={modalFormStyle}>
          <p style={helpTextStyle}>
            Envie um .txt ou .docx com uma palavra por linha, formato{" "}
            <strong>palavra**tradução</strong>. Cada envio substitui o dicionário anterior
            daquele idioma.
          </p>
          <select
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            style={inputStyle}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".txt,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={inputStyle}
          />
          {statusMessage && <p style={errorTextStyle}>{statusMessage}</p>}
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? "Importando..." : "Importar documento"}
          </button>
        </form>
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

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: 16,
};

const titleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 22, fontWeight: 800, margin: 0 };
const subtitleStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, marginTop: 4 };

const addButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  background: GRADIENT_PRIMARY,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
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

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "flex-end",
  zIndex: 10,
};

const modalStyle: CSSProperties = {
  width: "100%",
  background: COLOR_SURFACE,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
};

const modalHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
};

const modalTitleStyle: CSSProperties = { fontSize: 17, fontWeight: 700, margin: 0 };

const closeButtonStyle: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "none",
  background: COLOR_BACKGROUND,
  color: COLOR_TEXT_PRIMARY,
  cursor: "pointer",
};

const modalFormStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

const helpTextStyle: CSSProperties = { fontSize: 12, color: COLOR_TEXT_SECONDARY, margin: 0, lineHeight: 1.5 };

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_BACKGROUND,
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
};

const errorTextStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 12 };

const submitButtonStyle: CSSProperties = {
  padding: "13px 0",
  borderRadius: 10,
  border: "none",
  background: ACCENT_COLOR,
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};
