import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { ACCENT_COLOR, GRADIENT_PRIMARY } from "../core/constants/appConstants";

const TABS = [
  { to: "/", label: "Início", icon: "🏠" },
  { to: "/detector", label: "Detector", icon: "📷" },
  { to: "/biblioteca", label: "Biblioteca", icon: "📚" },
  { to: "/videos", label: "Vídeos", icon: "🎬" },
  { to: "/perfil", label: "Perfil", icon: "👤" },
];

/// Navegação inferior fixa, no estilo padrão de apps Android (Material
/// Design bottom navigation) — prioriza experiência mobile, como pedido.
export function BottomNav() {
  return (
    <nav style={navStyle}>
      <div style={topAccentStyle} />
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          style={({ isActive }) => ({
            ...tabStyle,
            color: isActive ? ACCENT_COLOR : "rgba(255, 255, 255, 0.5)",
          })}
        >
          <span style={iconStyle}>{tab.icon}</span>
          <span style={labelStyle}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

const navStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  height: 64,
  background: "#000",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  flexShrink: 0,
};

const topAccentStyle: CSSProperties = {
  position: "absolute",
  top: -1,
  left: 0,
  right: 0,
  height: 2,
  background: GRADIENT_PRIMARY,
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
