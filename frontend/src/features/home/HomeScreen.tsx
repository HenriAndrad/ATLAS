import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Camera, Search, Star, Globe, Settings, Film, GraduationCap } from "lucide-react";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../../core/constants/appConstants";

const SHORTCUTS = [
  { to: "/biblioteca", Icon: BookOpen, label: "Biblioteca", subtitle: "Conteúdos escolares", color: "#3B82F6" },
  { to: "/detector", Icon: Camera, label: "Detector", subtitle: "Identificar palavras", color: "#10B981" },
  { to: "/dicionario", Icon: Search, label: "Dicionário", subtitle: "Traduções", color: "#14B8A6" },
  { to: "/favoritos", Icon: Star, label: "Favoritos", subtitle: "Itens salvos", color: "#F59E0B" },
  { to: "/idiomas", Icon: Globe, label: "Idiomas", subtitle: "6 idiomas", color: "#8B5CF6" },
  { to: "/videos", Icon: Film, label: "Vídeos", subtitle: "Aulas e dicas", color: "#EC4899" },
  { to: "/configuracoes", Icon: Settings, label: "Ajustes", subtitle: "Preferências", color: "#4B5563" },
];

/// Aba "Início": dashboard de boas-vindas com atalhos para as
/// principais funcionalidades do app.
export function HomeScreen() {
  return (
    <div style={containerStyle}>
      <p style={greetingStyle}>Olá!</p>
      <h1 style={titleStyle}>Bem-vindo ao ATLAS</h1>

      <div style={bannerStyle}>
        <span style={bannerIconStyle}>
          <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
        </span>
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
            <span style={{ ...iconBadgeStyle, background: shortcut.color }}>
              <shortcut.Icon size={20} color="#fff" strokeWidth={2.2} />
            </span>
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
  boxShadow: "0 10px 24px rgba(16, 185, 129, 0.28)",
};

const bannerIconStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "rgba(255, 255, 255, 0.2)",
  marginBottom: 10,
};

const bannerTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  margin: "0 0 6px",
};

const bannerTextStyle: CSSProperties = {
  color: "rgba(255, 255, 255, 0.92)",
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
  borderRadius: 18,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  boxShadow: "0 3px 10px rgba(17, 24, 39, 0.06)",
  textDecoration: "none",
  transition: "transform 0.15s ease",
};

const iconBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: 12,
  marginBottom: 4,
};

const cardLabelStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 14, fontWeight: 700 };
const cardSubtitleStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 11 };
