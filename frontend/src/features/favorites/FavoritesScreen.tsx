import { useState, type CSSProperties } from "react";
import { Star, X } from "lucide-react";
import { useDetectionHistory } from "../detector/useDetectionHistory";
import { useTranslation } from "../../core/i18n/useTranslation";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  type SupportedLanguage,
} from "../../core/constants/appConstants";

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  de: "Alemão",
  fr: "Francês",
  ht: "Crioulo",
};

type Tab = "palavras" | "conteudos";

/// Aba "Favoritos": palavras favoritadas no Detector (dado real, salvo
/// no localStorage) e conteúdos da Biblioteca (ainda não implementado —
/// a Biblioteca não tem botão de favoritar ainda).
export function FavoritesScreen() {
  const { history, toggleFavorite } = useDetectionHistory();
  const [tab, setTab] = useState<Tab>("palavras");
  const t = useTranslation();

  const favoriteWords = history.filter((entry) => entry.favorite);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t("favorites.title")}</h1>
      <p style={subtitleStyle}>{t("favorites.subtitle")}</p>

      <div style={tabsStyle}>
        <button
          onClick={() => setTab("palavras")}
          style={{ ...tabButtonStyle, ...(tab === "palavras" ? tabButtonActiveStyle : {}) }}
        >
          {t("favorites.words")} ({favoriteWords.length})
        </button>
        <button
          onClick={() => setTab("conteudos")}
          style={{ ...tabButtonStyle, ...(tab === "conteudos" ? tabButtonActiveStyle : {}) }}
        >
          {t("favorites.contents")} (0)
        </button>
      </div>

      {tab === "palavras" && (
        <div style={listStyle}>
          {favoriteWords.length === 0 && <p style={emptyStyle}>{t("favorites.emptyWords")}</p>}
          {favoriteWords.map((entry) => (
            <div key={entry.id} style={itemStyle}>
              <span style={starBadgeStyle}>
                <Star size={16} color="#D97706" fill="#D97706" />
              </span>
              <span style={itemTextStyle}>
                <span style={itemTitleStyle}>{entry.translated}</span>
                <span style={itemSubtitleStyle}>
                  {entry.original} • {LANGUAGE_NAMES[entry.language]}
                </span>
              </span>
              <button
                onClick={() => toggleFavorite(entry.id)}
                style={removeButtonStyle}
                aria-label="Remover dos favoritos"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "conteudos" && <p style={emptyStyle}>{t("favorites.emptyContents")}</p>}
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

const tabsStyle: CSSProperties = { display: "flex", gap: 8, marginBottom: 16 };

const tabButtonStyle: CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 10,
  border: "none",
  background: COLOR_SURFACE,
  color: COLOR_TEXT_SECONDARY,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const tabButtonActiveStyle: CSSProperties = { background: ACCENT_COLOR, color: "#fff" };

const listStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 14,
  borderRadius: 14,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const starBadgeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "#FEF3C7",
  fontSize: 16,
};

const itemTextStyle: CSSProperties = { display: "flex", flexDirection: "column", flex: 1 };
const itemTitleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 14, fontWeight: 700 };
const itemSubtitleStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 12 };

const removeButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  color: COLOR_TEXT_SECONDARY,
  fontSize: 14,
  cursor: "pointer",
};

const emptyStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  textAlign: "center",
  marginTop: 24,
  border: `1px dashed ${COLOR_BORDER}`,
  borderRadius: 12,
  padding: 24,
};
