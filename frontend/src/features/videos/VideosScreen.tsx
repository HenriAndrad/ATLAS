import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import { fetchVideos } from "./videosApi";
import type { VideoContent } from "./types";
import { useLanguageContext } from "../../core/context/LanguageContext";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from "../../core/constants/appConstants";

/// Aba "Vídeos": lista os vídeos cadastrados pelo administrador (via
/// link do YouTube), filtrados pelo idioma escolhido pelo usuário e
/// agrupados por categoria. O vídeo é exibido embutido — o link nunca
/// aparece pro aluno.
export function VideosScreen() {
  const { targetLanguage } = useLanguageContext();
  const [videos, setVideos] = useState<VideoContent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch(() => setError("Não foi possível carregar os vídeos agora."));
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
      <h1 style={titleStyle}>Vídeos</h1>
      <p style={subtitleStyle}>Aulas, dicas e desafios de idiomas</p>

      {error && <p style={messageStyle}>{error}</p>}
      {!error && videos === null && <p style={messageStyle}>...</p>}

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
                {playingId === video.id ? (
                  <iframe
                    style={iframeStyle}
                    src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button style={thumbnailButtonStyle} onClick={() => setPlayingId(video.id)}>
                    {video.thumbnail_url && (
                      <img src={video.thumbnail_url} alt="" style={thumbnailImageStyle} />
                    )}
                    <span style={playIconStyle}>
                      <Play size={20} color="#fff" fill="#fff" />
                    </span>
                  </button>
                )}
                <p style={videoTitleStyle}>{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
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

const titleStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 22, fontWeight: 800, margin: 0 };
const subtitleStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  margin: "4px 0 20px",
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

const thumbnailButtonStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  border: "none",
  padding: 0,
  background: "#000",
  cursor: "pointer",
};

const thumbnailImageStyle: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

const playIconStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 0, 0, 0.25)",
};

const iframeStyle: CSSProperties = { width: "100%", aspectRatio: "16 / 9", border: "none" };

const videoTitleStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 13,
  fontWeight: 600,
  padding: "10px 12px",
  margin: 0,
};
