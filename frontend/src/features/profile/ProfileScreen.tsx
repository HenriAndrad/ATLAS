import type { CSSProperties } from "react";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../../core/auth/AuthContext";
import {
  APP_NAME,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from "../../core/constants/appConstants";

/// Aba "Perfil": mostra quem está logado e o botão de sair. Não existe
/// mais uma página separada de administrador — quem loga como admin
/// ganha botões "+" direto nas telas de Biblioteca, Vídeos e Dicionário.
export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Perfil</h1>

      <div style={cardStyle}>
        <span style={avatarStyle}>
          <User size={28} color={COLOR_TEXT_SECONDARY} />
        </span>
        <p style={usernameStyle}>{user?.username}</p>
        {user?.is_admin ? (
          <span style={adminBadgeStyle}>
            <ShieldCheck size={14} /> Administrador
          </span>
        ) : (
          <p style={emailStyle}>{user?.email}</p>
        )}
      </div>

      <button onClick={logout} style={logoutButtonStyle}>
        <LogOut size={16} />
        Sair
      </button>

      <p style={versionStyle}>{APP_NAME} · v0.1</p>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: 20,
  height: "100%",
  color: COLOR_TEXT_PRIMARY,
  fontFamily: "system-ui, sans-serif",
  background: COLOR_BACKGROUND,
};

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: "0 0 20px" };

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  padding: "32px 24px",
  borderRadius: 16,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  textAlign: "center",
};

const avatarStyle: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: COLOR_BACKGROUND,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 4,
};

const usernameStyle: CSSProperties = { fontSize: 16, fontWeight: 700, margin: 0 };
const emailStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, margin: 0 };

const adminBadgeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  color: "#10B981",
  fontSize: 12,
  fontWeight: 700,
};

const logoutButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  marginTop: 16,
  padding: "12px 0",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  color: "#EF4444",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const versionStyle: CSSProperties = {
  marginTop: 24,
  textAlign: "center",
  color: COLOR_TEXT_SECONDARY,
  fontSize: 12,
};
