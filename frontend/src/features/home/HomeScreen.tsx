import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../core/constants/appConstants";

/// Aba "Início": tela de boas-vindas com atalho direto pro Detector,
/// que é a funcionalidade principal do app.
export function HomeScreen() {
  return (
    <div style={containerStyle}>
      <span style={logoStyle}>{APP_NAME}</span>
      <p style={taglineStyle}>Aprenda idiomas apontando a câmera pro mundo ao seu redor.</p>

      <Link to="/detector" style={ctaStyle}>
        📷 Ir para o Detector
      </Link>
    </div>
  );
}

const containerStyle: CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: 32,
  textAlign: "center",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  background: "#0a0a0a",
};

const logoStyle: CSSProperties = { fontSize: 32, fontWeight: 800, letterSpacing: 1 };
const taglineStyle: CSSProperties = {
  color: "rgba(255, 255, 255, 0.65)",
  fontSize: 14,
  maxWidth: 280,
};

const ctaStyle: CSSProperties = {
  marginTop: 12,
  padding: "14px 28px",
  borderRadius: 24,
  background: "#3B82F6",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  textDecoration: "none",
};
