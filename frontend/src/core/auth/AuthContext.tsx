import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API_BASE_URL } from "../constants/appConstants";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  storeAuth,
  type AuthUser,
} from "./authStorage";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    lgpdAccepted: boolean,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ao carregar o app, confirma que o token salvo ainda é válido no
  // backend (pode ter expirado ou o usuário pode ter sido removido).
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("sessão inválida");
        return response.json();
      })
      .then((data: AuthUser) => setUser(data))
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(username: string, password: string): Promise<void> {
    setError(null);
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.detail ?? "Falha ao entrar.";
      setError(message);
      throw new Error(message);
    }

    const data = await response.json();
    storeAuth(data.token, data.user);
    setUser(data.user);
  }

  async function register(
    email: string,
    username: string,
    password: string,
    lgpdAccepted: boolean,
  ): Promise<void> {
    setError(null);
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        lgpd_accepted: lgpdAccepted,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.detail ?? "Falha ao criar conta.";
      setError(message);
      throw new Error(message);
    }

    const data = await response.json();
    storeAuth(data.token, data.user);
    setUser(data.user);
  }

  function logout(): void {
    clearAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro de um <AuthProvider>.");
  }
  return context;
}
