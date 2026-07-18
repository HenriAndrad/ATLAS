import { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../core/constants/appConstants";

const STORAGE_KEY = "vision-translator:target-language";

function readStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "pt";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage;
  }
  return "pt";
}

/// Gerencia o idioma de destino escolhido pelo usuário, salvando no
/// localStorage para persistir entre sessões (não é sensível, então
/// não há problema em guardar no navegador).
export function useLanguageSelection() {
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>(readStoredLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, targetLanguage);
  }, [targetLanguage]);

  return { targetLanguage, setTargetLanguage };
}
