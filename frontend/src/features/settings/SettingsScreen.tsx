import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../../core/context/LanguageContext";
import { useAppSettings, type FontSize } from "./useAppSettings";
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
  const { settings, updateSetting } = useAppSettings();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Configurações</h1>
      <p style={subtitleStyle}>Personalize sua experiência</p>

      <Section label="Idioma">
        <Link to="/idiomas" style={rowLinkStyle}>
          <span style={{ ...iconBadgeStyle, background: "#DBEAFE" }}>🌐</span>
          <span style={rowTextStyle}>{LANGUAGE_NAMES[targetLanguage]}</span>
          <span style={chevronStyle}>›</span>
        </Link>
      </Section>

      <Section label="Tema">
        <Row
          icon="☀️"
          iconBg="#FEF3C7"
          label="Modo Claro"
          checked={settings.theme === "light"}
          onChange={(checked) => updateSetting("theme", checked ? "light" : "dark")}
        />
      </Section>

      <Section label="Tamanho da fonte">
        <div style={fontSizeCardStyle}>
          <div style={fontSizeHeaderStyle}>
            <span style={{ ...iconBadgeStyle, background: "#D1FAE5" }}>🔤</span>
            <span style={rowTextStyle}>Tamanho do texto</span>
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

      <Section label="Notificações">
        <Row
          icon="🔔"
          iconBg="#F3F4F6"
          label="Lembretes diários"
          checked={settings.dailyReminders}
          onChange={(checked) => updateSetting("dailyReminders", checked)}
        />
        <Row
          icon="🔊"
          iconBg="#F3F4F6"
          label="Sons"
          checked={settings.soundEnabled}
          onChange={(checked) => updateSetting("soundEnabled", checked)}
        />
      </Section>

      <Section label="Acessibilidade">
        <Row
          icon="♿"
          iconBg="#F3F4F6"
          label="Alto contraste"
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
  icon,
  iconBg,
  label,
  checked,
  onChange,
}: {
  icon: string;
  iconBg: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div style={rowStyle}>
      <span style={{ ...iconBadgeStyle, background: iconBg }}>{icon}</span>
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
const chevronStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 18 };

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
