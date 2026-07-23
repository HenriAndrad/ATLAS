import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Trash2 } from "lucide-react";
import { fetchLibrary } from "./libraryApi";
import { createAdminCategory, deleteAdminCategory } from "../admin/adminApi";
import type { LibraryCategory } from "./types";
import { useAuth } from "../../core/auth/AuthContext";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
} from "../../core/constants/appConstants";

/// Aba "Biblioteca": lista as matérias escolares cadastradas.
/// Cada card leva para /biblioteca/categoria/:id, com o conteúdo
/// daquela matéria no idioma escolhido em Idiomas.
export function LibraryScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<LibraryCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function loadCategories() {
    try {
      setCategories(await fetchLibrary());
    } catch {
      setError("Não foi possível carregar a Biblioteca agora.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Biblioteca</h1>
          <p style={subtitleStyle}>Escolha uma matéria para estudar</p>
        </div>
        {user?.is_admin && (
          <button onClick={() => setIsAdding(true)} style={addButtonStyle} aria-label="Adicionar matéria">
            <Plus size={20} color="#fff" />
          </button>
        )}
      </div>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && categories === null && <p style={messageStyle}>Carregando...</p>}
      {categories !== null && categories.length === 0 && !error && (
        <p style={messageStyle}>Nenhuma matéria cadastrada ainda.</p>
      )}

      <div style={gridStyle}>
        {(categories ?? []).map((category) => (
          <div key={category.id} style={{ position: "relative" }}>
            <Link to={`/biblioteca/categoria/${category.id}`} style={cardStyle}>
              <span style={emojiStyle}>{category.icon_emoji}</span>
              <span style={nameStyle}>{category.name}</span>
            </Link>
            {user?.is_admin && (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (!confirm(`Excluir a matéria "${category.name}" e todas as suas palavras?`)) return;
                  await deleteAdminCategory(category.id);
                  loadCategories();
                }}
                style={deleteBadgeStyle}
                aria-label="Excluir matéria"
              >
                <Trash2 size={13} color="#fff" />
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdding && (
        <NewCategoryModal
          onClose={() => setIsAdding(false)}
          onCreated={() => {
            setIsAdding(false);
            loadCategories();
          }}
        />
      )}
    </div>
  );
}

function NewCategoryModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📘");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createAdminCategory(name.trim(), emoji.trim() || "📘");
      onCreated();
    } catch {
      setError("Falha ao criar a matéria.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Nova matéria</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={modalFormStyle}>
          <input
            placeholder="Nome (ex: Matemática)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            placeholder="Emoji (ex: 📐)"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            style={inputStyle}
          />
          {error && <p style={errorTextStyle}>{error}</p>}
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? "Criando..." : "Criar matéria"}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: 20,
  paddingBottom: 96,
  color: COLOR_TEXT_PRIMARY,
  fontFamily: "system-ui, sans-serif",
  height: "100%",
  overflowY: "auto",
  background: COLOR_BACKGROUND,
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: 20,
};

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: 0 };
const subtitleStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 14, marginTop: 4 };

const addButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  background: GRADIENT_PRIMARY,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

const messageStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13 };

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  padding: "24px 12px",
  borderRadius: 20,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  color: COLOR_TEXT_PRIMARY,
  textDecoration: "none",
};

const emojiStyle: CSSProperties = { fontSize: 32 };
const nameStyle: CSSProperties = { fontSize: 14, fontWeight: 600, textAlign: "center" };

const deleteBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 24,
  height: 24,
  borderRadius: "50%",
  border: "none",
  background: "#EF4444",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_BACKGROUND,
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
};

const errorTextStyle: CSSProperties = { color: "#EF4444", fontSize: 13 };

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
