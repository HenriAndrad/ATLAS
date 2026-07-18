const STORAGE_KEY = "vision-translator:admin-credentials";

// sessionStorage (não localStorage) de propósito: as credenciais somem
// quando a aba é fechada, em vez de ficar guardadas indefinidamente.

export function setAdminCredentials(username: string, password: string): void {
  const encoded = btoa(`${username}:${password}`);
  window.sessionStorage.setItem(STORAGE_KEY, encoded);
}

export function clearAdminCredentials(): void {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function getAdminAuthHeader(): string | null {
  const encoded = window.sessionStorage.getItem(STORAGE_KEY);
  return encoded ? `Basic ${encoded}` : null;
}

export function isAdminLoggedIn(): boolean {
  return getAdminAuthHeader() !== null;
}
