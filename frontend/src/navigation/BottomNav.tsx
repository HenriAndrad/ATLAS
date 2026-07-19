import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import {
  ACCENT_COLOR,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../core/constants/appConstants";

const LEFT_TABS = [
  { to: "/", label: "Início", icon: "🏠" },
  { to: "/biblioteca", label: "Biblioteca", icon: "📖" },
];

const RIGHT_TABS = [
  { to: "/favoritos", label: "Favoritos", icon: "⭐" },
  { to: "/perfil", label: "Perfil", icon: "👤" },
];

/// Navegação inferior fixa, com o Detector em destaque como botão
/// flutuante central — é o recurso principal do app.
export function BottomNav() {
  return (
    <nav style={navStyle}>
      {LEFT_TABS.map((tab) => (
        <TabLink key={tab.to} {...tab} />
      ))}

      {/* Espaço reservado sob o botão flutuante */}
      <div style={{ flex: 1 }} />

      {RIGHT_TABS.map((tab) => (
        <TabLink key={tab.to} {...tab} />
      ))}

      <NavLink to="/detector" style={centerButtonStyle} aria-label="Detector">
        📷
      </NavLink>
    </nav>
  );
}

function TabLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      style={({ isActive }) => ({
        ...tabStyle,
        color: isActive ? ACCENT_COLOR : COLOR_TEXT_SECONDARY,
      })}
    >
      <span style={iconStyle}>{icon}</span>
      <span style={labelStyle}>{label}</span>
    </NavLink>
  );
}

const navStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  height: 64,
  background: COLOR_SURFACE,
  borderTop: `1px solid ${COLOR_BORDER}`,
  flexShrink: 0,
};

const tabStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  textDecoration: "none",
  fontFamily: "system-ui, sans-serif",
};

const iconStyle: CSSProperties = { fontSize: 20 };
const labelStyle: CSSProperties = { fontSize: 10, fontWeight: 600 };

const centerButtonStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: -22,
  transform: "translateX(-50%)",
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: GRADIENT_PRIMARY,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
  border: `4px solid ${COLOR_SURFACE}`,
  textDecoration: "none",
};
