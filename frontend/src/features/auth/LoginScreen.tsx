import { useState, type CSSProperties, type FormEvent } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import {
  APP_NAME,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../../core/constants/appConstants";

type Mode = "login" | "register";

const LGPD_TEXT =
  "Ao criar sua conta, você concorda que o ATLAS guarde seu e-mail, nome de usuário e senha " +
  "(sempre criptografada, nunca em texto simples) para permitir seu login e salvar seu progresso. " +
  "Não compartilhamos seus dados com terceiros para fins de marketing. Você pode pedir a exclusão " +
  "da sua conta e dos seus dados a qualquer momento, conforme a Lei Geral de Proteção de Dados (LGPD).";

/// Tela inicial obrigatória: login ou cadastro. Nada do app aparece
/// antes disso — é o "portão de entrada" único, tanto para alunos
/// quanto para o administrador (que usa as mesmas credenciais de
/// sempre no campo de login).
export function LoginScreen() {
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError(null);

    if (mode === "register" && !lgpdAccepted) {
      setLocalError("Você precisa aceitar os termos de privacidade (LGPD) para criar uma conta.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(username.trim(), password);
      } else {
        await register(email.trim(), username.trim(), password, lgpdAccepted);
      }
    } catch {
      // O erro já fica disponível via `error` do contexto.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={containerStyle}>
      <span style={logoStyle}>{APP_NAME}</span>
      <p style={taglineStyle}>Aprenda idiomas apontando a câmera pro mundo ao seu redor.</p>

      <div style={tabsStyle}>
        <button
          onClick={() => setMode("login")}
          style={{ ...tabButtonStyle, ...(mode === "login" ? tabButtonActiveStyle : {}) }}
        >
          Entrar
        </button>
        <button
          onClick={() => setMode("register")}
          style={{ ...tabButtonStyle, ...(mode === "register" ? tabButtonActiveStyle : {}) }}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        {mode === "register" && (
          <p style={domainNoteStyle}>Só e-mails @edu.sapiranga.rs.gov.br podem se cadastrar.</p>
        )}
        {mode === "register" && (
          <input
            type="email"
            placeholder="nome@edu.sapiranga.rs.gov.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        )}
        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        {mode === "register" && (
          <label style={lgpdLabelStyle}>
            <input
              type="checkbox"
              checked={lgpdAccepted}
              onChange={(e) => setLgpdAccepted(e.target.checked)}
              style={lgpdCheckboxStyle}
            />
            <span>{LGPD_TEXT}</span>
          </label>
        )}

        {(localError || error) && <p style={errorStyle}>{localError ?? error}</p>}

        <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
          {isSubmitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <p style={footnoteStyle}>
        Isso não é aconselhamento jurídico — se o ATLAS for usado comercialmente com muitos
        usuários, vale revisar esse texto com um advogado.
      </p>
    </div>
  );
}

const containerStyle: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "48px 24px 24px",
  background: COLOR_BACKGROUND,
  fontFamily: "system-ui, sans-serif",
};

const logoStyle: CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: 1,
  backgroundImage: GRADIENT_PRIMARY,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const taglineStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  textAlign: "center",
  maxWidth: 280,
  margin: "8px 0 28px",
};

const tabsStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  width: "100%",
  maxWidth: 340,
  marginBottom: 20,
};

const tabButtonStyle: CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  color: COLOR_TEXT_SECONDARY,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const tabButtonActiveStyle: CSSProperties = {
  background: "#3B82F6",
  color: "#fff",
  borderColor: "transparent",
};

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  width: "100%",
  maxWidth: 340,
};

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
};

const lgpdLabelStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "flex-start",
  fontSize: 11,
  color: COLOR_TEXT_SECONDARY,
  lineHeight: 1.5,
  padding: "4px 2px",
};

const lgpdCheckboxStyle: CSSProperties = { marginTop: 2, flexShrink: 0 };

const domainNoteStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 11,
  textAlign: "center",
  margin: 0,
};

const errorStyle: CSSProperties = { color: "#EF4444", fontSize: 13 };

const primaryButtonStyle: CSSProperties = {
  padding: "13px 0",
  borderRadius: 10,
  border: "none",
  background: GRADIENT_PRIMARY,
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  marginTop: 4,
};

const footnoteStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 10,
  textAlign: "center",
  maxWidth: 300,
  marginTop: 24,
  opacity: 0.7,
};
