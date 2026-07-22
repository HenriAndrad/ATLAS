import { createContext, useContext, type ReactNode } from "react";
import { useLanguageSelection } from "../../features/settings/useLanguageSelection";
import type { SupportedLanguage } from "../constants/appConstants";

interface LanguageContextValue {
  targetLanguage: SupportedLanguage;
  setTargetLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { targetLanguage, setTargetLanguage } = useLanguageSelection();

  return (
    <LanguageContext.Provider value={{ targetLanguage, setTargetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext precisa estar dentro de um <LanguageProvider>.");
  }
  return context;
}
