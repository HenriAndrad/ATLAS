import type { CSSProperties } from "react";
import { ACCENT_COLOR, SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../core/constants/appConstants";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
  de: "DE",
};

interface LanguageSelectorProps {
  selected: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
}

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  return (
    <div style={containerStyle}>
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isSelected = lang === selected;
        return (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            style={{
              ...pillStyle,
              background: isSelected ? ACCENT_COLOR : "transparent",
              color: isSelected ? "#fff" : "rgba(255, 255, 255, 0.75)",
              fontWeight: isSelected ? 700 : 500,
            }}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        );
      })}
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: "flex",
  gap: 4,
  background: "rgba(0, 0, 0, 0.4)",
  padding: 4,
  borderRadius: 20,
  backdropFilter: "blur(8px)",
};

const pillStyle: CSSProperties = {
  border: "none",
  borderRadius: 16,
  padding: "6px 14px",
  fontSize: 13,
  fontFamily: "system-ui, sans-serif",
  cursor: "pointer",
  transition: "background 0.15s ease, color 0.15s ease",
};
