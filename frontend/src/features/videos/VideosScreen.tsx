import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { fetchVideos } from "./videosApi";
import { createAdminVideo, deleteAdminVideo } from "../admin/adminApi";
import { fetchLibrary } from "../library/libraryApi";
import type { LibraryCategory } from "../library/types";
import type { VideoContent } from "./types";
import { useAuth } from "../../core/auth/AuthContext";
import { useLanguageContext } from "../../core/context/LanguageContext";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
  SUPPORTED_LANGUAGES,
} from "../../core/constants/appConstants";

/// Aba "Vídeos": lista os vídeos enviados pelo administrador (arquivo
/// de verdade, guardado no Supabase Storage — não link do YouTube),
/// filtrados pelo idioma escolhido e agrupados por categoria.
export function VideosScreen() {
  const { user } = useAuth();
  const { targetLanguage } = useLanguageContext();
  const [videos, setVideos] = useState<VideoContent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function loadVideos() {
    try {
      setVideos(await fetchVideos());
    } catch {
      setError("Não foi possível carregar os vídeos agora.");
    }
  }

  useEffect(() => {
    loadVideos();
  }, []);

  const groupedByCategory = useMemo(() => {
    const filtered = (videos ?? []).filter((video) => video.language_code === targetLanguage);
    const groups = new Map<string, VideoContent[]>();
    for (const video of filtered) {
      const list = groups.get(video.category) ?? [];
      list.push(video);
      groups.set(video.category, list);
    }
    return Array.from(groups.entries());
  }, [videos, targetLanguage]);

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Vídeos</h1>
          <p style={subtitleStyle}>Aulas, dicas e desafios de idiomas</p>
        </div>
        {user?.is_admin && (
          <button onClick={() => setIsAdding(true)} style={addButtonStyle} aria-label="Adicionar vídeo">
            <Plus size={20} color="#fff" />
          </button>
        )}
      </div>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && videos === null && <p style={messageStyle}>Carregando...</p>}

      {videos !== null && groupedByCategory.length === 0 && !error && (
        <div style={emptyStateStyle}>
          <span style={emptyIconStyle}>🎬</span>
          <p style={emptyTextStyle}>Nenhum vídeo cadastrado ainda neste idioma.</p>
        </div>
      )}

      {groupedByCategory.map(([category, categoryVideos]) => (
        <div key={category} style={categoryBlockStyle}>
          <p style={categoryTitleStyle}>{category}</p>
          <div style={videoListStyle}>
            {categoryVideos.map((video) => (
              <div key={video.id} style={videoCardStyle}>
                {video.video_type === "youtube" ? (
                  <iframe
                    style={videoElementStyle}
                    src={video.video_url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video style={videoElementStyle} src={video.video_url} controls preload="metadata" />
                )}
                <div style={videoFooterStyle}>
                  <p style={videoTitleStyle}>{video.title}</p>
                  {user?.is_admin && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Excluir o vídeo "${video.title}"?`)) return;
                        await deleteAdminVideo(video.id);
                        loadVideos();
                      }}
                      style={deleteIconButtonStyle}
                      aria-label="Excluir vídeo"
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isAdding && (
        <NewVideoModal
          onClose={() => setIsAdding(false)}
          onCreated={() => {
            setIsAdding(false);
            loadVideos();
          }}
        />
      )}
    </div>
  );
}

function NewVideoModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [sourceMode, setSourceMode] = useState<"file" | "youtube">("file");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [languageCode, setLanguageCode] = useState<string>(SUPPORTED_LANGUAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLibrary()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setCategory(data[0].name);
      })
      .catch(() => {
        // Se a Biblioteca não carregar, o admin ainda digita a categoria manualmente.
      });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (sourceMode === "file" && !file) {
      setError("Escolha um arquivo de vídeo.");
      return;
    }
    if (sourceMode === "youtube" && !youtubeUrl.trim()) {
      setError("Cole um link do YouTube.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdminVideo({
        file: sourceMode === "file" ? file ?? undefined : undefined,
        youtubeUrl: sourceMode === "youtube" ? youtubeUrl.trim() : undefined,
        title: title.trim(),
        category: category.trim(),
        languageCode,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao adicionar o vídeo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Novo vídeo</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>

        <div style={sourceTabsStyle}>
          <button
            type="button"
            onClick={() => setSourceMode("file")}
            style={{ ...sourceTabStyle, ...(sourceMode === "file" ? sourceTabActiveStyle : {}) }}
          >
            Arquivo
          </button>
          <button
            type="button"
            onClick={() => setSourceMode("youtube")}
            style={{ ...sourceTabStyle, ...(sourceMode === "youtube" ? sourceTabActiveStyle : {}) }}
          >
            Link do YouTube
          </button>
        </div>

        <form onSubmit={handleSubmit} style={modalFormStyle}>
          {sourceMode === "file" ? (
            <>
              <p style={helpTextStyle}>
                Escolha um vídeo da galeria do seu dispositivo (até 80 MB).
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={inputStyle}
              />
            </>
          ) : (
            <>
              <p style={helpTextStyle}>
                Cole o link do vídeo público do YouTube — ele abre embutido direto na página.
              </p>
              <input
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={inputStyle}
              />
            </>
          )}
          <input
            placeholder="Título do vídeo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            required
          />
          {categories.length > 0 ? (
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon_emoji} {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              placeholder="Matéria (ex: Matemática) — crie uma na Biblioteca primeiro"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
              required
            />
          )}
          <select
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            style={inputStyle}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          {error && <p style={errorTextStyle}>{error}</p>}
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? "Enviando..." : "Adicionar vídeo"}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  height: "100%",
  overflowY: "auto",
  padding: 20,
  paddingBottom: 96,
  background: COLOR_BACKGROUND,
  fontFamily: "system-ui, sans-serif",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: 20,
};

const titleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 22, fontWeight: 800, margin: 0 };
const subtitleStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, marginTop: 4 };

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

const messageStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, textAlign: "center" };

const emptyStateStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: "48px 24px",
  borderRadius: 16,
  border: `1px dashed ${COLOR_BORDER}`,
  textAlign: "center",
};

const emptyIconStyle: CSSProperties = { fontSize: 36 };
const emptyTextStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, maxWidth: 240 };

const categoryBlockStyle: CSSProperties = { marginBottom: 24 };
const categoryTitleStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 10,
};

const videoListStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

const videoCardStyle: CSSProperties = {
  borderRadius: 16,
  overflow: "hidden",
  background: COLOR_SURFACE,
  border: `1px solid ${COLOR_BORDER}`,
};

const videoElementStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  display: "block",
  background: "#000",
  border: "none",
};

const videoTitleStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
  flex: 1,
};

const videoFooterStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
};

const deleteIconButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  flexShrink: 0,
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
  maxHeight: "85%",
  overflowY: "auto",
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

const helpTextStyle: CSSProperties = { fontSize: 12, color: COLOR_TEXT_SECONDARY, margin: 0, lineHeight: 1.5 };

const sourceTabsStyle: CSSProperties = { display: "flex", gap: 8, marginBottom: 12 };

const sourceTabStyle: CSSProperties = {
  flex: 1,
  padding: "8px 0",
  borderRadius: 8,
  border: `1px solid ${COLOR_BORDER}`,
  background: "transparent",
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const sourceTabActiveStyle: CSSProperties = {
  background: ACCENT_COLOR,
  color: "#fff",
  borderColor: "transparent",
};

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
