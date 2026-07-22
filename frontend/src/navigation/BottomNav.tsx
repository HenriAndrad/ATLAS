import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Camera, Star, User } from "lucide-react";
import { useTranslation } from "../core/i18n/useTranslation";
import type { TranslationKey } from "../core/i18n/translations";
import {
  ACCENT_COLOR,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../core/constants/appConstants";

const LEFT_TABS: { to: string; labelKey: TranslationKey; Icon: typeof Home }[] = [
  { to: "/", labelKey: "nav.home", Icon: Home },
  { to: "/biblioteca", labelKey: "nav.library", Icon: BookOpen },
];

const RIGHT_TABS: { to: string; labelKey: TranslationKey; Icon: typeof Home }[] = [
  { to: "/favoritos", labelKey: "nav.favorites", Icon: Star },
  { to: "/perfil", labelKey: "nav.profile", Icon: User },
];

/// Navegação inferior fixa, com o Detector em destaque como botão
/// flutuante central — é o recurso principal do app.
export function BottomNav() {
  const t = useTranslation();

  return (
    <nav style={navStyle}>
      {LEFT_TABS.map((tab) => (
        <TabLink key={tab.to} to={tab.to} label={t(tab.labelKey)} Icon={tab.Icon} />
      ))}

      {/* Espaço reservado sob o botão flutuante */}
      <div style={{ flex: 1 }} />

      {RIGHT_TABS.map((tab) => (
        <TabLink key={tab.to} to={tab.to} label={t(tab.labelKey)} Icon={tab.Icon} />
      ))}

      <NavLink to="/detector" style={centerButtonStyle} aria-label={t("shortcut.detector")}>
        <Camera size={24} color="#fff" strokeWidth={2.2} />
      </NavLink>
    </nav>
  );
}

function TabLink({
  to,
  label,
  Icon,
}: {
  to: string;
  label: string;
  Icon: typeof Home;
}) {
  return (
    <NavLink
      key={to}
      to={to}
      end={to === "/"}
      style={({ isActive }) => ({
        ...tabStyle,
        color: isActive ? ACCENT_COLOR : COLOR_TEXT_SECONDARY,
      })}
    >
      <Icon size={20} strokeWidth={2.2} />
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
  gap: 3,
  textDecoration: "none",
  fontFamily: "system-ui, sans-serif",
};

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
  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
  border: `4px solid ${COLOR_SURFACE}`,
  textDecoration: "none",
};
