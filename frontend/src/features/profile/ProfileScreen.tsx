import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../core/constants/appConstants";

/// Aba "Perfil": preparada para a futura conta do aluno (login,
/// progresso, preferências). Hoje mostra só informações estáticas do app.
export function ProfileScreen() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Perfil</h1>

      <div style={cardStyle}>
        <span style={avatarStyle}>👤</span>
        <p style={placeholderTextStyle}>
          Conta do aluno em breve — aqui você vai poder ver seu progresso e
          preferências.
        </p>
      </div>

      <p style={versionStyle}>{APP_NAME} · v0.1</p>

      <Link to="/admin" style={adminLinkStyle}>
        Área do administrador
      </Link>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: 20,
  height: "100%",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  background: "#0a0a0a",
};

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: "0 0 20px" };

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
  padding: "32px 24px",
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.05)",
  textAlign: "center",
};

const avatarStyle: CSSProperties = { fontSize: 40 };
const placeholderTextStyle: CSSProperties = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: 14,
  maxWidth: 240,
};

const versionStyle: CSSProperties = {
  marginTop: 24,
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.35)",
  fontSize: 12,
};

const adminLinkStyle: CSSProperties = {
  display: "block",
  marginTop: 12,
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.3)",
  fontSize: 11,
  textDecoration: "underline",
};
