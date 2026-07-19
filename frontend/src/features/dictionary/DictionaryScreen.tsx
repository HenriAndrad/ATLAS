import type { CSSProperties } from "react";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from "../../core/constants/appConstants";

/// Aba "Dicionário": pesquisar palavras por nome/categoria/idioma.
/// Ainda não implementado — vai reaproveitar os dados da Biblioteca.
export function DictionaryScreen() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dicionário</h1>
      <p style={subtitleStyle}>Pesquise palavras traduzidas</p>

      <div style={emptyStateStyle}>
        <span style={emptyIconStyle}>🔍</span>
        <p style={emptyTextStyle}>Em breve — busca por palavra, categoria e idioma.</p>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  height: "100%",
  padding: 20,
  background: COLOR_BACKGROUND,
  fontFamily: "system-ui, sans-serif",
};

const titleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 22, fontWeight: 800, margin: 0 };
const subtitleStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  margin: "4px 0 20px",
};

const emptyStateStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: "48px 24px",
  borderRadius: 16,
  border: `1px dashed ${COLOR_BORDER}`,
  textAlign: "center",
};

const emptyIconStyle: CSSProperties = { fontSize: 36 };
const emptyTextStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, maxWidth: 220 };
