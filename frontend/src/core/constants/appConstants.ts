export const APP_NAME = "Vision Translator AI";

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
