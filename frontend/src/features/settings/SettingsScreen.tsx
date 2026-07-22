import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Globe, Sun, Type, Bell, Volume2, Accessibility, ChevronRight } from "lucide-react";
import { useLanguageContext } from "../../core/context/LanguageContext";
import { useAppSettingsContext } from "../../core/context/AppSettingsContext";
import { useTranslation } from "../../core/i18n/useTranslation";
import type { FontSize } from "./useAppSettings";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  type SupportedLanguage,
} from "../../core/constants/appConstants";

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  de: "Alemão",
  fr: "Francês",
  ht: "Crioulo Haitiano",
};

/// Aba "Configurações": idioma, tema, fonte, notificações e acessibilidade.
///
/// Nem tudo aqui já tem efeito visual completo — cada item indica
/// claramente se é totalmente funcional ou só uma preferência salva
/// aguardando a implementação visual completa (tema escuro/fonte).
export function SettingsScreen() {
  const { targetLanguage } = useLanguageContext();
  const { settings, updateSetting } = useAppSettingsContext();
  const t = useTranslation();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t("settings.title")}</h1>
      <p style={subtitleStyle}>{t("settings.subtitle")}</p>

      <Section label={t("settings.language")}>
        <Link to="/idiomas" style={rowLinkStyle}>
          <span style={{ ...iconBadgeStyle, background: "#DBEAFE" }}>
            <Globe size={16} color="#3B82F6" />
          </span>
          <span style={rowTextStyle}>{LANGUAGE_NAMES[targetLanguage]}</span>
          <ChevronRight size={18} color={COLOR_TEXT_SECONDARY} />
        </Link>
      </Section>

      <Section label={t("settings.theme")}>
        <Row
          Icon={Sun}
          iconColor="#D97706"
          iconBg="#FEF3C7"
          label={t("settings.themeLight")}
          checked={settings.theme === "light"}
          onChange={(checked) => updateSetting("theme", checked ? "light" : "dark")}
        />
      </Section>

      <Section label={t("settings.fontSize")}>
        <div style={fontSizeCardStyle}>
          <div style={fontSizeHeaderStyle}>
            <span style={{ ...iconBadgeStyle, background: "#D1FAE5" }}>
              <Type size={16} color="#059669" />
            </span>
            <span style={rowTextStyle}>{t("settings.fontSize")}</span>
          </div>
          <div style={fontSizeOptionsStyle}>
            {(["sm", "md", "lg"] as FontSize[]).map((size) => (
              <button
                key={size}
                onClick={() => updateSetting("fontSize", size)}
                style={{
                  ...fontSizeButtonStyle,
                  background: settings.fontSize === size ? ACCENT_COLOR : COLOR_BACKGROUND,
                  color: settings.fontSize === size ? "#fff" : COLOR_TEXT_PRIMARY,
                  fontSize: size === "sm" ? 13 : size === "md" ? 16 : 19,
                }}
              >
                A
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section label={t("settings.notifications")}>
        <Row
          Icon={Bell}
          iconColor="#6B7280"
          iconBg="#F3F4F6"
          label={t("settings.dailyReminders")}
          checked={settings.dailyReminders}
          onChange={(checked) => updateSetting("dailyReminders", checked)}
        />
        <Row
          Icon={Volume2}
          iconColor="#6B7280"
          iconBg="#F3F4F6"
          label={t("settings.sounds")}
          checked={settings.soundEnabled}
          onChange={(checked) => updateSetting("soundEnabled", checked)}
        />
      </Section>

      <Section label={t("settings.accessibility")}>
        <Row
          Icon={Accessibility}
          iconColor="#6B7280"
          iconBg="#F3F4F6"
          label={t("settings.highContrast")}
          checked={settings.highContrast}
          onChange={(checked) => updateSetting("highContrast", checked)}
        />
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={sectionStyle}>
      <p style={sectionLabelStyle}>{label}</p>
      <div style={sectionBodyStyle}>{children}</div>
    </div>
  );
}

function Row({
  Icon,
  iconColor,
  iconBg,
  label,
  checked,
  onChange,
}: {
  Icon: typeof Sun;
  iconColor: string;
  iconBg: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div style={rowStyle}>
      <span style={{ ...iconBadgeStyle, background: iconBg }}>
        <Icon size={16} color={iconColor} />
      </span>
      <span style={rowTextStyle}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          ...toggleTrackStyle,
          background: checked ? ACCENT_COLOR : "#D1D5DB",
        }}
        aria-pressed={checked}
        aria-label={label}
      >
        <span style={{ ...toggleThumbStyle, left: checked ? 22 : 2 }} />
      </button>
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

const titleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 22, fontWeight: 800, margin: 0 };
const subtitleStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  margin: "4px 0 20px",
};

const sectionStyle: CSSProperties = { marginBottom: 18 };
const sectionLabelStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  margin: "0 0 8px",
};
const sectionBodyStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 14,
  borderRadius: 14,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const rowLinkStyle: CSSProperties = { ...rowStyle, textDecoration: "none" };

const iconBadgeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 8,
  fontSize: 15,
  flexShrink: 0,
};

const rowTextStyle: CSSProperties = { flex: 1, color: COLOR_TEXT_PRIMARY, fontSize: 14, fontWeight: 600 };

const toggleTrackStyle: CSSProperties = {
  position: "relative",
  width: 44,
  height: 24,
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
};

const toggleThumbStyle: CSSProperties = {
  position: "absolute",
  top: 2,
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#fff",
  transition: "left 0.15s ease",
};

const fontSizeCardStyle: CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const fontSizeHeaderStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 };

const fontSizeOptionsStyle: CSSProperties = { display: "flex", gap: 8 };

const fontSizeButtonStyle: CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  fontWeight: 700,
  cursor: "pointer",
};
