export const APP_NAME = "ATLAS";

export const ACCENT_COLOR = "#3B82F6";
export const ACCENT_GREEN = "#10B981";
export const GRADIENT_PRIMARY = "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)";

// Paleta do tema claro (padrão do app)
export const COLOR_BACKGROUND = "#F3F4F6";
export const COLOR_SURFACE = "#FFFFFF";
export const COLOR_BORDER = "#E5E7EB";
export const COLOR_TEXT_PRIMARY = "#111827";
export const COLOR_TEXT_SECONDARY = "#6B7280";

// Abaixo deste score, nem mostramos a caixa (ruído/falso positivo).
export const MIN_DETECTION_SCORE = 0.5;
// Abaixo deste score, mostramos "objeto não identificado" em vez de
// arriscar uma tradução errada.
export const MIN_CONFIDENT_LABEL_SCORE = 0.65;

// Em desenvolvimento, cai automaticamente no backend local.
// Em produção (GitHub Pages), é definida por VITE_API_BASE_URL
// (configurada em Settings > Secrets and variables > Actions > Variables).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "de", "fr", "ht"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
