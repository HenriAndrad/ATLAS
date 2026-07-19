import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../core/constants/appConstants";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from "../../core/constants/appConstants";

const LANGUAGE_DISPLAY: Record<SupportedLanguage, { name: string; flag: string }> = {
  pt: { name: "Português", flag: "🇧🇷" },
  en: { name: "Inglês", flag: "🇺🇸" },
  es: { name: "Espanhol", flag: "🇪🇸" },
  de: { name: "Alemão", flag: "🇩🇪" },
  fr: { name: "Francês", flag: "🇫🇷" },
  ht: { name: "Crioulo Haitiano", flag: "🇭🇹" },
};

/// Aba "Biblioteca": lista os idiomas disponíveis para estudo.
/// Cada card leva para /biblioteca/:lang, que busca o conteúdo real no backend.
export function LibraryScreen() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Biblioteca</h1>
      <p style={subtitleStyle}>Escolha um idioma para estudar</p>

      <div style={gridStyle}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const { name, flag } = LANGUAGE_DISPLAY[lang];
          return (
            <Link key={lang} to={`/biblioteca/${lang}`} style={cardStyle}>
              <span style={flagStyle}>{flag}</span>
              <span style={nameStyle}>{name}</span>
            </Link>
          );
        })}
      </div>
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

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: 0 };
const subtitleStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 14,
  marginTop: 4,
  marginBottom: 20,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  padding: "24px 12px",
  borderRadius: 20,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  color: COLOR_TEXT_PRIMARY,
  textDecoration: "none",
};

const flagStyle: CSSProperties = { fontSize: 32 };
const nameStyle: CSSProperties = { fontSize: 14, fontWeight: 600 };
