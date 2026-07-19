import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import {
  clearAdminCredentials,
  isAdminLoggedIn,
  setAdminCredentials,
} from "./adminAuth";
import {
  createAdminCategory,
  createAdminWord,
  deleteAdminWord,
  fetchAdminCategories,
  updateAdminWord,
  verifyAdminCredentials,
  type AdminCategory,
} from "./adminApi";
import { fetchLibrary } from "../library/libraryApi";
import type { LibraryCategory } from "../library/types";
import { ACCENT_COLOR, GRADIENT_PRIMARY, SUPPORTED_LANGUAGES } from "../../core/constants/appConstants";

const TRANSLATABLE_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) => lang !== "en");

/// Área do administrador: login com usuário/senha e um painel simples
/// para adicionar ou remover palavras do banco, sem precisar mexer em
/// código ou rodar scripts.
export function AdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());

  if (!isLoggedIn) {
    return <AdminLogin onLoggedIn={() => setIsLoggedIn(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        clearAdminCredentials();
        setIsLoggedIn(false);
      }}
    />
  );
}

function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setAdminCredentials(username, password);
    const isValid = await verifyAdminCredentials();

    if (isValid) {
      onLoggedIn();
    } else {
      clearAdminCredentials();
      setError("Usuário ou senha incorretos.");
    }
    setIsSubmitting(false);
  }

  return (
    <div style={loginContainerStyle}>
      <h1 style={titleStyle}>Área do administrador</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [words, setWords] = useState<LibraryCategory[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState<number | "new">("new");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [originalEn, setOriginalEn] = useState("");
  const [emoji, setEmoji] = useState("");
  const [exampleSentenceEn, setExampleSentenceEn] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [editingWordId, setEditingWordId] = useState<number | null>(null);

  async function loadData() {
    const [categoriesData, libraryData] = await Promise.all([
      fetchAdminCategories(),
      fetchLibrary(),
    ]);
    setCategories(categoriesData);
    setWords(libraryData);
  }

  useEffect(() => {
    loadData().catch(() => setStatusMessage("Falha ao carregar dados."));
  }, []);

  function handleStartEdit(categoryIdForWord: number, word: LibraryCategory["words"][number]) {
    setEditingWordId(word.id);
    setCategoryId(categoryIdForWord);
    setOriginalEn(word.original_en);
    setEmoji(word.emoji ?? "");
    setExampleSentenceEn(word.example_sentence_en ?? "");
    const translationMap: Record<string, string> = {};
    word.translations.forEach((t) => {
      translationMap[t.language_code] = t.translated_text;
    });
    setTranslations(translationMap);
    setStatusMessage(null);
  }

  function handleCancelEdit() {
    setEditingWordId(null);
    setCategoryId("new");
    setOriginalEn("");
    setEmoji("");
    setExampleSentenceEn("");
    setTranslations({});
  }

  async function handleAddWord(event: FormEvent) {
    event.preventDefault();
    setStatusMessage(null);

    try {
      let finalCategoryId = categoryId;

      if (finalCategoryId === "new") {
        if (!newCategoryName.trim()) {
          setStatusMessage("Dê um nome para a nova categoria.");
          return;
        }
        const created = await createAdminCategory(newCategoryName.trim(), "📁");
        finalCategoryId = created.id;
      }

      const wordPayload = {
        category_id: finalCategoryId,
        original_en: originalEn.trim(),
        emoji: emoji.trim(),
        expected_confidence: 0.6,
        example_sentence_en: exampleSentenceEn.trim(),
        translations: TRANSLATABLE_LANGUAGES.filter((lang) => translations[lang]?.trim()).map(
          (lang) => ({ language_code: lang, translated_text: translations[lang].trim() }),
        ),
      };

      if (editingWordId !== null) {
        await updateAdminWord(editingWordId, wordPayload);
        setStatusMessage("Palavra atualizada com sucesso.");
      } else {
        await createAdminWord(wordPayload);
        setStatusMessage("Palavra adicionada com sucesso.");
      }

      setEditingWordId(null);
      setOriginalEn("");
      setEmoji("");
      setExampleSentenceEn("");
      setTranslations({});
      setNewCategoryName("");
      setCategoryId("new");
      await loadData();
    } catch {
      setStatusMessage("Falha ao salvar a palavra.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAdminWord(id);
      await loadData();
    } catch {
      setStatusMessage("Falha ao excluir a palavra.");
    }
  }

  return (
    <div style={dashboardContainerStyle}>
      <div style={headerRowStyle}>
        <h1 style={titleStyle}>Administrador</h1>
        <button onClick={onLogout} style={logoutButtonStyle}>
          Sair
        </button>
      </div>

      <form onSubmit={handleAddWord} style={formStyle}>
        <h2 style={sectionTitleStyle}>{editingWordId !== null ? "Editar palavra" : "Nova palavra"}</h2>

        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value === "new" ? "new" : Number(e.target.value))
          }
          style={inputStyle}
        >
          <option value="new">+ Nova categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon_emoji} {category.name}
            </option>
          ))}
        </select>

        {categoryId === "new" && (
          <input
            placeholder="Nome da nova categoria (ex: Escola)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          placeholder="Palavra original em inglês (ex: Pencil)"
          value={originalEn}
          onChange={(e) => setOriginalEn(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          placeholder="Emoji (ex: ✏️)"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Frase de exemplo em inglês"
          value={exampleSentenceEn}
          onChange={(e) => setExampleSentenceEn(e.target.value)}
          style={inputStyle}
        />

        <h3 style={sectionTitleStyle}>Traduções</h3>
        {TRANSLATABLE_LANGUAGES.map((lang) => (
          <input
            key={lang}
            placeholder={`Tradução em ${lang.toUpperCase()}`}
            value={translations[lang] ?? ""}
            onChange={(e) => setTranslations((prev) => ({ ...prev, [lang]: e.target.value }))}
            style={inputStyle}
          />
        ))}

        {statusMessage && <p style={statusStyle}>{statusMessage}</p>}

        <button type="submit" style={primaryButtonStyle}>
          {editingWordId !== null ? "Salvar alterações" : "Adicionar palavra"}
        </button>
        {editingWordId !== null && (
          <button type="button" onClick={handleCancelEdit} style={logoutButtonStyle}>
            Cancelar edição
          </button>
        )}
      </form>

      <h2 style={sectionTitleStyle}>Palavras cadastradas</h2>
      {words.map((category) => (
        <div key={category.id} style={categoryBlockStyle}>
          <p style={categoryNameStyle}>
            {category.icon_emoji} {category.name}
          </p>
          {category.words.map((word) => (
            <div key={word.id} style={wordRowStyle}>
              <span>
                {word.emoji} {word.original_en} ({word.translations.length} traduções)
              </span>
              <span style={wordActionsStyle}>
                <button onClick={() => handleStartEdit(category.id, word)} style={editButtonStyle}>
                  Editar
                </button>
                <button onClick={() => handleDelete(word.id)} style={deleteButtonStyle}>
                  Excluir
                </button>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const loginContainerStyle: CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "#0a0a0a",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
};

const dashboardContainerStyle: CSSProperties = {
  height: "100%",
  overflowY: "auto",
  padding: 20,
  paddingBottom: 96,
  background: "#0a0a0a",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const titleStyle: CSSProperties = { fontSize: 22, fontWeight: 700, margin: "0 0 16px" };
const sectionTitleStyle: CSSProperties = { fontSize: 15, fontWeight: 700, margin: "16px 0 8px" };

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  width: "100%",
  maxWidth: 360,
};

const inputStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.15)",
  background: "rgba(255, 255, 255, 0.05)",
  color: "#fff",
  fontSize: 14,
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 20px",
  borderRadius: 10,
  border: "none",
  background: GRADIENT_PRIMARY,
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const logoutButtonStyle: CSSProperties = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "transparent",
  color: "#fff",
  fontSize: 13,
  cursor: "pointer",
};

const errorStyle: CSSProperties = { color: "#f87171", fontSize: 13 };
const statusStyle: CSSProperties = { color: "rgba(255, 255, 255, 0.7)", fontSize: 13 };

const categoryBlockStyle: CSSProperties = { marginBottom: 16 };
const categoryNameStyle: CSSProperties = { fontWeight: 700, fontSize: 14, marginBottom: 6 };

const wordRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
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

const editButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(59, 130, 246, 0.15)",
  color: ACCENT_COLOR,
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 12,
  cursor: "pointer",
};

const wordActionsStyle: CSSProperties = {
  display: "flex",
  gap: 6,
  flexShrink: 0,
};
