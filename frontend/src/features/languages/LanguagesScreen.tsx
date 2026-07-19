import type { CSSProperties } from "react";
import { useLanguageContext } from "../../core/context/LanguageContext";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../../core/constants/appConstants";

const LANGUAGE_INFO: Record<SupportedLanguage, { code: string; namePt: string; nameNative: string }> = {
  pt: { code: "BR", namePt: "Português", nameNative: "Português" },
  ht: { code: "HT", namePt: "Crioulo Haitiano", nameNative: "Kreyòl Ayisyen" },
  en: { code: "US", namePt: "Inglês", nameNative: "English" },
  es: { code: "ES", namePt: "Espanhol", nameNative: "Español" },
  fr: { code: "FR", namePt: "Francês", nameNative: "Français" },
  de: { code: "DE", namePt: "Alemão", nameNative: "Deutsch" },
};

/// Aba "Idiomas": escolhe o idioma de destino usado em todo o app —
/// Detector, Biblioteca e leitura em voz alta. Usa o LanguageContext
/// global, então a mudança vale para o app inteiro imediatamente.
export function LanguagesScreen() {
  const { targetLanguage, setTargetLanguage } = useLanguageContext();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Idiomas</h1>
      <p style={subtitleStyle}>Selecione seu idioma principal</p>

      <div style={listStyle}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const info = LANGUAGE_INFO[lang];
          const isSelected = lang === targetLanguage;
          return (
            <button
              key={lang}
              onClick={() => setTargetLanguage(lang)}
              style={{
                ...rowStyle,
                border: isSelected ? `2px solid ${ACCENT_COLOR}` : `1px solid ${COLOR_BORDER}`,
              }}
            >
              <span style={codeStyle}>{info.code}</span>
              <span style={namesStyle}>
                <span style={namePtStyle}>{info.namePt}</span>
                <span style={nameNativeStyle}>{info.nameNative}</span>
              </span>
              {isSelected && <span style={checkStyle}>✓</span>}
            </button>
          );
        })}
      </div>

      <p style={noteStyle}>Novos idiomas podem ser adicionados pelo administrador.</p>
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
  margin: "4px 0 20px",
};

const listStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: 14,
  borderRadius: 14,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  cursor: "pointer",
  textAlign: "left",
};

const codeStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: COLOR_TEXT_SECONDARY,
  width: 28,
};

const namesStyle: CSSProperties = { display: "flex", flexDirection: "column", flex: 1 };
const namePtStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 15, fontWeight: 700 };
const nameNativeStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 12 };

const checkStyle: CSSProperties = { color: ACCENT_COLOR, fontSize: 16, fontWeight: 700 };

const noteStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 12,
  textAlign: "center",
  marginTop: 20,
};
