import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { LogOut, ShieldCheck, User, UserPlus, X } from "lucide-react";
import { useAuth } from "../../core/auth/AuthContext";
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  type AdminManagedUser,
} from "../admin/adminApi";
import {
  ACCENT_COLOR,
  APP_NAME,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../../core/constants/appConstants";

/// Aba "Perfil": informações da conta + botão de sair. Se quem está
/// logado é o administrador, aparece também uma seção pra criar e
/// gerenciar contas de aluno — não existe mais tela separada de admin.
export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Perfil</h1>

      <div style={cardStyle}>
        <span style={avatarStyle}>
          <User size={28} color={COLOR_TEXT_SECONDARY} />
        </span>
        <p style={usernameStyle}>{user?.username}</p>
        {user?.is_admin ? (
          <span style={adminBadgeStyle}>
            <ShieldCheck size={14} /> Administrador
          </span>
        ) : (
          <p style={emailStyle}>{user?.email}</p>
        )}
      </div>

      <button onClick={logout} style={logoutButtonStyle}>
        <LogOut size={16} />
        Sair
      </button>

      {user?.is_admin && <AdminUsersSection />}

      <p style={versionStyle}>{APP_NAME} · v0.1</p>
    </div>
  );
}

function AdminUsersSection() {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setUsers(await fetchAdminUsers());
    } catch {
      setStatusMessage("Falha ao carregar contas.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteAdminUser(id);
      await loadUsers();
    } catch {
      setStatusMessage("Falha ao excluir conta.");
    }
  }

  return (
    <div style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <p style={sectionTitleStyle}>Contas de aluno</p>
        <button onClick={() => setIsCreating(true)} style={addButtonStyle} aria-label="Criar conta">
          <UserPlus size={18} color="#fff" />
        </button>
      </div>

      {statusMessage && <p style={messageStyle}>{statusMessage}</p>}
      {users.length === 0 && <p style={messageStyle}>Nenhuma conta criada ainda.</p>}

      <div style={listStyle}>
        {users.map((u) => (
          <div key={u.id} style={userRowStyle}>
            <span>
              {u.username} — {u.email}
            </span>
            <button onClick={() => handleDelete(u.id)} style={deleteButtonStyle}>
              Excluir
            </button>
          </div>
        ))}
      </div>

      {isCreating && (
        <NewUserModal
          onClose={() => setIsCreating(false)}
          onCreated={() => {
            setIsCreating(false);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}

function NewUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createAdminUser({ email: email.trim(), username: username.trim(), password });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Nova conta de aluno</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={modalFormStyle}>
          <p style={helpTextStyle}>
            Só e-mails @edu.sapiranga.rs.gov.br são aceitos.
          </p>
          <input
            type="email"
            placeholder="nome@edu.sapiranga.rs.gov.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Senha inicial"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          {error && <p style={errorTextStyle}>{error}</p>}
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? "Criando..." : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: 20,
  height: "100%",
  overflowY: "auto",
  color: COLOR_TEXT_PRIMARY,
  fontFamily: "system-ui, sans-serif",
  background: COLOR_BACKGROUND,
};

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: "0 0 20px" };

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  padding: "32px 24px",
  borderRadius: 16,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  textAlign: "center",
};

const avatarStyle: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: COLOR_BACKGROUND,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 4,
};

const usernameStyle: CSSProperties = { fontSize: 16, fontWeight: 700, margin: 0 };
const emailStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, margin: 0 };

const adminBadgeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  color: "#10B981",
  fontSize: 12,
  fontWeight: 700,
};

const logoutButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  marginTop: 16,
  padding: "12px 0",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  color: "#EF4444",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const sectionStyle: CSSProperties = { marginTop: 28 };

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const sectionTitleStyle: CSSProperties = { fontSize: 15, fontWeight: 700, margin: 0 };

const addButtonStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: GRADIENT_PRIMARY,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const messageStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13 };

const listStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };

const userRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderRadius: 10,
  background: COLOR_SURFACE,
  border: `1px solid ${COLOR_BORDER}`,
  fontSize: 13,
};

const deleteButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(248, 113, 113, 0.15)",
  color: "#f87171",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 12,
  cursor: "pointer",
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "flex-end",
  zIndex: 10,
};

const modalStyle: CSSProperties = {
  width: "100%",
  background: COLOR_SURFACE,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
};

const modalHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
};

const modalTitleStyle: CSSProperties = { fontSize: 17, fontWeight: 700, margin: 0 };

const closeButtonStyle: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "none",
  background: COLOR_BACKGROUND,
  color: COLOR_TEXT_PRIMARY,
  cursor: "pointer",
};

const modalFormStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

const helpTextStyle: CSSProperties = { fontSize: 12, color: COLOR_TEXT_SECONDARY, margin: 0 };

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_BACKGROUND,
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
};

const errorTextStyle: CSSProperties = { color: "#EF4444", fontSize: 13 };

const versionStyle: CSSProperties = {
  marginTop: 24,
  textAlign: "center",
  color: COLOR_TEXT_SECONDARY,
  fontSize: 12,
};

const submitButtonStyle: CSSProperties = {
  padding: "13px 0",
  borderRadius: 10,
  border: "none",
  background: ACCENT_COLOR,
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};
