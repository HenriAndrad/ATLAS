import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Camera, Search, Star, Globe, Settings, Film, GraduationCap, Bell, X } from "lucide-react";
import { useTranslation } from "../../core/i18n/useTranslation";
import type { TranslationKey } from "../../core/i18n/translations";
import { useAppSettingsContext } from "../../core/context/AppSettingsContext";
import { useDailyReminder } from "./useDailyReminder";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../../core/constants/appConstants";

const SHORTCUTS: {
  to: string;
  Icon: typeof BookOpen;
  labelKey: TranslationKey;
  subtitleKey: TranslationKey;
  color: string;
}[] = [
  { to: "/biblioteca", Icon: BookOpen, labelKey: "shortcut.library", subtitleKey: "shortcut.librarySubtitle", color: "#3B82F6" },
  { to: "/detector", Icon: Camera, labelKey: "shortcut.detector", subtitleKey: "shortcut.detectorSubtitle", color: "#10B981" },
  { to: "/dicionario", Icon: Search, labelKey: "shortcut.dictionary", subtitleKey: "shortcut.dictionarySubtitle", color: "#14B8A6" },
  { to: "/favoritos", Icon: Star, labelKey: "shortcut.favorites", subtitleKey: "shortcut.favoritesSubtitle", color: "#F59E0B" },
  { to: "/idiomas", Icon: Globe, labelKey: "shortcut.languages", subtitleKey: "shortcut.languagesSubtitle", color: "#8B5CF6" },
  { to: "/videos", Icon: Film, labelKey: "shortcut.videos", subtitleKey: "shortcut.videosSubtitle", color: "#EC4899" },
  { to: "/configuracoes", Icon: Settings, labelKey: "shortcut.settings", subtitleKey: "shortcut.settingsSubtitle", color: "#4B5563" },
];

/// Aba "Início": dashboard de boas-vindas com atalhos para as
/// principais funcionalidades do app.
export function HomeScreen() {
  const t = useTranslation();
  const { settings } = useAppSettingsContext();
  const { shouldShow, dismiss } = useDailyReminder(settings.dailyReminders);

  return (
    <div style={containerStyle}>
      <p style={greetingStyle}>{t("home.greeting")}</p>
      <h1 style={titleStyle}>{t("home.title")}</h1>

      {shouldShow && (
        <div style={reminderStyle}>
          <Bell size={16} color="#3B82F6" />
          <span style={reminderTextStyle}>Hora de praticar um pouco hoje! 🎯</span>
          <button onClick={dismiss} style={reminderCloseStyle} aria-label="Fechar lembrete">
            <X size={14} />
          </button>
        </div>
      )}

      <div style={bannerStyle}>
        <span style={bannerIconStyle}>
          <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
        </span>
        <p style={bannerTitleStyle}>{t("home.bannerTitle")}</p>
        <p style={bannerTextStyle}>{t("home.bannerText")}</p>
      </div>

      <p style={sectionLabelStyle}>{t("home.shortcuts")}</p>
      <div style={gridStyle}>
        {SHORTCUTS.map((shortcut) => (
          <Link key={shortcut.to} to={shortcut.to} style={cardStyle}>
            <span style={{ ...iconBadgeStyle, background: shortcut.color }}>
              <shortcut.Icon size={20} color="#fff" strokeWidth={2.2} />
            </span>
            <span style={cardLabelStyle}>{t(shortcut.labelKey)}</span>
            <span style={cardSubtitleStyle}>{t(shortcut.subtitleKey)}</span>
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

const reminderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 12,
  background: "#EFF6FF",
  marginBottom: 16,
};

const reminderTextStyle: CSSProperties = {
  flex: 1,
  fontSize: 13,
  fontWeight: 600,
  color: COLOR_TEXT_PRIMARY,
};

const reminderCloseStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  color: COLOR_TEXT_SECONDARY,
  cursor: "pointer",
  flexShrink: 0,
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
