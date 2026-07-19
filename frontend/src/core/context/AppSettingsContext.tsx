import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAppSettings, type AppSettings } from "../../features/settings/useAppSettings";

interface AppSettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

/// Fonte única de verdade das configurações do app — sem isso, a tela
/// de Configurações e o resto do app teriam cada um sua própria cópia
/// do estado (lidas separadamente do localStorage) e ficariam
/// dessincronizadas até a página recarregar.
///
/// Também é responsável por REALMENTE aplicar tema, contraste e
/// tamanho de fonte no documento inteiro, via CSS custom properties
/// definidas em index.css — assim funciona em qualquer tela sem
/// precisar reescrever cada componente pra ler o contexto.
export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const { settings, updateSetting } = useAppSettings();

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.dataset.highContrast = String(settings.highContrast);
  }, [settings.highContrast]);

  useEffect(() => {
    const scale = settings.fontSize === "sm" ? 0.92 : settings.fontSize === "lg" ? 1.15 : 1;
    document.documentElement.style.setProperty("--atlas-zoom", String(scale));
  }, [settings.fontSize]);

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettingsContext precisa estar dentro de um <AppSettingsProvider>.");
  }
  return context;
}
