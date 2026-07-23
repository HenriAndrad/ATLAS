import { useState } from "react";

const STORAGE_KEY = "vision-translator:last-reminder-date";

function todayString(): string {
  return new Date().toDateString();
}

/// Mostra o lembrete no máximo uma vez por dia civil, e só se
/// "Lembretes diários" estiver ligado em Configurações.
export function useDailyReminder(enabled: boolean) {
  const [dismissed, setDismissed] = useState(() => {
    return window.localStorage.getItem(STORAGE_KEY) === todayString();
  });

  const shouldShow = enabled && !dismissed;

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, todayString());
    setDismissed(true);
  }

  return { shouldShow, dismiss };
}
