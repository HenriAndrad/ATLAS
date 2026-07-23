import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, X, Trash2 } from "lucide-react";
import { fetchLibrary } from "./libraryApi";
import type { LibraryCategory } from "./types";
import { fetchVideos } from "../videos/videosApi";
import type { VideoContent } from "../videos/types";
import { createAdminWord, deleteAdminWord, deleteAdminVideo } from "../admin/adminApi";
import { speakText } from "../tts/speakText";
import { useAuth } from "../../core/auth/AuthContext";
import { useLanguageContext } from "../../core/context/LanguageContext";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  SUPPORTED_LANGUAGES,
} from "../../core/constants/appConstants";

const TRANSLATABLE_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) => lang !== "en");

/// Mostra o vocabulário de uma matéria (categoria) no idioma
/// globalmente selecionado — a mesma escolha usada no Detector.
export function CategoryLibraryScreen() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const { targetLanguage } = useLanguageContext();

  const [categories, setCategories] = useState<LibraryCategory[] | null>(null);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function loadCategories() {
    try {
      const [libraryData, videosData] = await Promise.all([fetchLibrary(), fetchVideos()]);
      setCategories(libraryData);
      setVideos(videosData);
    } catch {
      setError("Não foi possível carregar o conteúdo agora.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const category = categories?.find((c) => String(c.id) === categoryId) ?? null;

  const categoryVideos = videos.filter(
    (video) => video.category === category?.name && video.language_code === targetLanguage,
  );

  const wordsWithTranslation = (category?.words ?? [])
    .map((word) => ({
      word,
      translation: word.translations.find((t) => t.language_code === targetLanguage),
    }))
    .filter(
      (entry): entry is { word: typeof entry.word; translation: NonNullable<typeof entry.translation> } =>
        Boolean(entry.translation),
    );

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <div>
          <Link to="/biblioteca" style={backLinkStyle}>
            ← Biblioteca
          </Link>
          <h1 style={titleStyle}>
            {category ? `${category.icon_emoji} ${category.name}` : "..."}
          </h1>
        </div>
        {user?.is_admin && category && (
          <button onClick={() => setIsAdding(true)} style={addButtonStyle} aria-label="Adicionar palavra">
            <Plus size={20} color="#fff" />
          </button>
        )}
      </div>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && categories === null && <p style={messageStyle}>Carregando...</p>}

      {categories !== null && wordsWithTranslation.length === 0 && !error && (
        <p style={messageStyle}>
          Ainda não há conteúdo cadastrado nesta matéria, neste idioma — novidades em breve.
        </p>
      )}

      <div style={wordsGridStyle}>
        {wordsWithTranslation.map(({ word, translation }) => (
          <div key={word.id} style={{ position: "relative" }}>
            <button
              style={wordCardStyle}
              onClick={() => speakText(translation.translated_text, targetLanguage)}
            >
              <span style={wordEmojiStyle}>{word.emoji ?? "🔤"}</span>
              <span style={wordOriginalStyle}>{word.original_en}</span>
              <span style={wordTranslatedStyle}>→ {translation.translated_text}</span>
              <span style={wordSpeakerStyle}>🔊</span>
            </button>
            {user?.is_admin && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm(`Excluir a palavra "${word.original_en}"?`)) return;
                  await deleteAdminWord(word.id);
                  loadCategories();
                }}
                style={deleteBadgeStyle}
                aria-label="Excluir palavra"
              >
                <Trash2 size={12} color="#fff" />
              </button>
            )}
          </div>
        ))}
      </div>

      {categoryVideos.length > 0 && (
        <>
          <p style={videosSectionTitleStyle}>🎬 Vídeos desta matéria</p>
          <div style={videosListStyle}>
            {categoryVideos.map((video) => (
              <div key={video.id} style={videoCardStyle}>
                <video style={videoElementStyle} src={video.video_url} controls preload="metadata" />
                <div style={videoFooterStyle}>
                  <p style={videoTitleStyle}>{video.title}</p>
                  {user?.is_admin && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Excluir o vídeo "${video.title}"?`)) return;
                        await deleteAdminVideo(video.id);
                        loadCategories();
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
        </>
      )}

      {isAdding && category && (
        <NewWordModal
          categoryId={category.id}
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

function NewWordModal({
  categoryId,
  onClose,
  onCreated,
}: {
  categoryId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [originalEn, setOriginalEn] = useState("");
  const [emoji, setEmoji] = useState("");
  const [exampleSentenceEn, setExampleSentenceEn] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createAdminWord({
        category_id: categoryId,
        original_en: originalEn.trim(),
        emoji: emoji.trim(),
        expected_confidence: 0.6,
        example_sentence_en: exampleSentenceEn.trim(),
        translations: TRANSLATABLE_LANGUAGES.filter((lang) => translations[lang]?.trim()).map(
          (lang) => ({ language_code: lang, translated_text: translations[lang].trim() }),
        ),
      });
      onCreated();
    } catch {
      setError("Falha ao salvar a palavra.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Nova palavra</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={modalFormStyle}>
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
          {TRANSLATABLE_LANGUAGES.map((lang) => (
            <input
              key={lang}
              placeholder={`Tradução em ${lang.toUpperCase()}`}
              value={translations[lang] ?? ""}
              onChange={(e) => setTranslations((prev) => ({ ...prev, [lang]: e.target.value }))}
              style={inputStyle}
            />
          ))}
          {error && <p style={errorTextStyle}>{error}</p>}
          <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
            {isSubmitting ? "Salvando..." : "Adicionar palavra"}
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

const backLinkStyle: CSSProperties = { color: ACCENT_COLOR, fontSize: 13, textDecoration: "none" };
const titleStyle: CSSProperties = { fontSize: 22, fontWeight: 700, margin: "6px 0 0" };

const addButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  background: ACCENT_COLOR,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

const messageStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, marginTop: 12 };

const wordsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 10,
};

const wordCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 4,
  padding: 12,
  borderRadius: 12,
  border: `1px solid ${COLOR_BORDER}`,
  background: COLOR_SURFACE,
  color: COLOR_TEXT_PRIMARY,
  textAlign: "left",
  cursor: "pointer",
  position: "relative",
};

const wordEmojiStyle: CSSProperties = { fontSize: 24 };
const wordOriginalStyle: CSSProperties = { fontSize: 12, color: COLOR_TEXT_SECONDARY };
const wordTranslatedStyle: CSSProperties = { fontSize: 14, fontWeight: 600 };
const wordSpeakerStyle: CSSProperties = { position: "absolute", top: 10, right: 10, fontSize: 14 };

const videosSectionTitleStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 15,
  fontWeight: 700,
  margin: "24px 0 12px",
};

const videosListStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

const videoCardStyle: CSSProperties = {
  borderRadius: 16,
  overflow: "hidden",
  background: COLOR_SURFACE,
  border: `1px solid ${COLOR_BORDER}`,
};

const videoElementStyle: CSSProperties = { width: "100%", display: "block", background: "#000" };

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

const deleteBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 6,
  right: 6,
  width: 20,
  height: 20,
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
