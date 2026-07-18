export const APP_NAME = "Vision Translator AI";

// Em desenvolvimento, cai automaticamente no backend local.
// Em produção, é definida por VITE_API_BASE_URL (configurada no painel da Vercel).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
