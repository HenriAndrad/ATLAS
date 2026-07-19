import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../../core/constants/appConstants";

const SHORTCUTS = [
  { to: "/biblioteca", icon: "📖", label: "Biblioteca", subtitle: "Conteúdos escolares", color: "#3B82F6" },
  { to: "/detector", icon: "📷", label: "Detector", subtitle: "Identificar palavras", color: "#10B981" },
  { to: "/dicionario", icon: "🔍", label: "Dicionário", subtitle: "Traduções", color: "#14B8A6" },
  { to: "/favoritos", icon: "⭐", label: "Favoritos", subtitle: "Itens salvos", color: "#F59E0B" },
  { to: "/idiomas", icon: "🌐", label: "Idiomas", subtitle: "6 idiomas", color: "#8B5CF6" },
  { to: "/configuracoes", icon: "⚙️", label: "Ajustes", subtitle: "Preferências", color: "#4B5563" },
];

/// Aba "Início": dashboard de boas-vindas com atalhos para as
/// principais funcionalidades do app.
export function HomeScreen() {
  return (
    <div style={containerStyle}>
      <p style={greetingStyle}>Olá!</p>
      <h1 style={titleStyle}>Bem-vindo ao ATLAS</h1>

      <div style={bannerStyle}>
        <span style={bannerIconStyle}>🎓</span>
        <p style={bannerTitleStyle}>Aprenda apontando a câmera</p>
        <p style={bannerTextStyle}>
          Com o ATLAS você identifica objetos ao seu redor e aprende o nome deles
          em outro idioma na hora, com tradução, pronúncia e exemplos de frases.
        </p>
      </div>

      <p style={sectionLabelStyle}>Atalhos</p>
      <div style={gridStyle}>
        {SHORTCUTS.map((shortcut) => (
          <Link key={shortcut.to} to={shortcut.to} style={cardStyle}>
            <span style={{ ...iconBadgeStyle, background: shortcut.color }}>{shortcut.icon}</span>
            <span style={cardLabelStyle}>{shortcut.label}</span>
            <span style={cardSubtitleStyle}>{shortcut.subtitle}</span>
          </Link>
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

const greetingStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, margin: 0 };
const titleStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 22,
  fontWeight: 800,
  margin: "2px 0 20px",
};

const bannerStyle: CSSProperties = {
  background: GRADIENT_PRIMARY,
  borderRadius: 20,
  padding: 20,
  marginBottom: 24,
  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
};

const bannerIconStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "rgba(255, 255, 255, 0.2)",
  fontSize: 18,
  marginBottom: 10,
};

const bannerTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  margin: "0 0 6px",
};

const bannerTextStyle: CSSProperties = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: 13,
  lineHeight: 1.5,
  margin: 0,
};

const sectionLabelStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 10px",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  borderRadius: 16,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  textDecoration: "none",
};

const iconBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  fontSize: 17,
  marginBottom: 4,
};

const cardLabelStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 14, fontWeight: 700 };
const cardSubtitleStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 11 };
