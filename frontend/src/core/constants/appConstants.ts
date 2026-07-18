export const APP_NAME = "Vision Translator AI";

export const ACCENT_COLOR = "#3B82F6";

// Em desenvolvimento, cai automaticamente no backend local.
// Em produção (GitHub Pages), é definida por VITE_API_BASE_URL
// (configurada em Settings > Secrets and variables > Actions > Variables).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
