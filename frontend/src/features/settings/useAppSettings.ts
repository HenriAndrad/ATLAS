import { useEffect, useState } from "react";

const STORAGE_KEY = "vision-translator:app-settings";

export type FontSize = "sm" | "md" | "lg";

export interface AppSettings {
  theme: "light" | "dark";
  fontSize: FontSize;
  dailyReminders: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  fontSize: "md",
  dailyReminders: true,
  soundEnabled: true,
  highContrast: false,
};

function readStoredSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/// Guarda as preferências do app no navegador.
///
/// Aviso importante: "tema escuro" e "tamanho da fonte" hoje só ficam
/// salvos — a aplicação visual completa desses dois em todas as telas
/// ainda não está pronta (é um retrabalho grande de CSS). "Som" já é
/// real: controla se o botão 🔊/leitura em voz alta toca ou não.
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(readStoredSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return { settings, updateSetting };
}

/// Lida fora de componentes React (ex: dentro de speakText).
export function isSoundEnabled(): boolean {
  return readStoredSettings().soundEnabled;
}
