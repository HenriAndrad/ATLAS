import type { CSSProperties } from "react";
import { Camera as CameraIcon, Info } from "lucide-react";
import { useCamera } from "./useCamera";
import { useObjectDetection } from "../detection/useObjectDetection";
import { DetectionOverlay } from "../detection/DetectionOverlay";
import { getPrimaryDetection } from "../detection/getPrimaryDetection";
import { useTranslatedLabels } from "../translation/useTranslatedLabels";
import { speakText } from "../tts/speakText";
import {
  ACCENT_COLOR,
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_SURFACE,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  GRADIENT_PRIMARY,
  MIN_CONFIDENT_LABEL_SCORE,
  type SupportedLanguage,
} from "../../core/constants/appConstants";

export interface RecentDetectionEntry {
  id: string;
  original: string;
  translated: string;
}

interface CameraViewProps {
  targetLanguage: SupportedLanguage;
  /** Disparado sempre que o aluno toca no 🔊 para ouvir uma tradução. */
  onWordSpoken?: (entry: { original: string; translated: string }) => void;
  /** Últimas palavras ouvidas, mostradas na tela antes de abrir a câmera. */
  recentEntries?: RecentDetectionEntry[];
}

const STATUS_CAPTION: Record<string, string> = {
  idle: "Câmera desativada",
  requesting: "Solicitando acesso...",
  denied: "Acesso à câmera negado",
  unavailable: "Nenhuma câmera encontrada",
  error: "Erro ao acessar a câmera",
};

/// Tela do Detector: antes de ligar a câmera, mostra um estado inicial
/// com botão "Abrir Câmera" e instruções — igual ao layout de
/// referência. Depois de ligada, mostra o preview em tela cheia com
/// detecção de objetos, tradução e leitura em voz alta.
export function CameraView({ targetLanguage, onWordSpoken, recentEntries = [] }: CameraViewProps) {
  const { videoRef, status, errorMessage, start, retry } = useCamera();
  const { status: modelStatus, detections } = useObjectDetection(
    videoRef,
    status === "ready",
  );
  const translations = useTranslatedLabels(
    detections.map((d) => d.class),
    targetLanguage,
  );

  const primaryDetection = getPrimaryDetection(detections, videoRef.current);
  const isPrimaryConfident =
    primaryDetection !== null && primaryDetection.score >= MIN_CONFIDENT_LABEL_SCORE;
  const primaryTranslatedText =
    primaryDetection && isPrimaryConfident
      ? translations[primaryDetection.class] ?? primaryDetection.class
      : null;

  if (status === "ready") {
    return (
      <div style={videoContainerStyle}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <DetectionOverlay detections={detections} videoRef={videoRef} translations={translations} />

        {modelStatus === "loading" && (
          <div style={modelLoadingBadgeStyle}>Carregando modelo de detecção...</div>
        )}

        <button
          disabled={!primaryTranslatedText}
          onClick={() => {
            if (primaryTranslatedText && primaryDetection) {
              speakText(primaryTranslatedText, targetLanguage);
              onWordSpoken?.({
                original: primaryDetection.class,
                translated: primaryTranslatedText,
              });
            }
          }}
          style={{
            ...speakButtonStyle,
            opacity: primaryTranslatedText ? 1 : 0.4,
            cursor: primaryTranslatedText ? "pointer" : "default",
          }}
          aria-label="Ouvir tradução do objeto apontado"
        >
          🔊
        </button>
      </div>
    );
  }

  return (
    <div style={idlePageStyle}>
      <h1 style={titleStyle}>Detector de Palavras</h1>
      <p style={subtitleStyle}>Aponte a câmera para identificar e traduzir palavras</p>

      <div style={placeholderBoxStyle}>
        <div style={placeholderCircleStyle}>
          <CameraIcon size={30} color="#fff" strokeWidth={2} />
        </div>
        <p style={placeholderCaptionStyle}>{STATUS_CAPTION[status]}</p>
        {status === "error" && errorMessage && <p style={errorDetailStyle}>{errorMessage}</p>}
      </div>

      {(status === "idle" || status === "denied") && (
        <button onClick={status === "denied" ? retry : start} style={startButtonStyle}>
          <CameraIcon size={18} color="#fff" />
          {status === "denied" ? "Permitir acesso" : "Abrir Câmera"}
        </button>
      )}

      <div style={infoBoxStyle}>
        <Info size={18} color={ACCENT_COLOR} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={infoTitleStyle}>Como usar</p>
          <ol style={infoListStyle}>
            <li>Toque em "Abrir Câmera"</li>
            <li>Aponte para uma palavra ou objeto</li>
            <li>A tradução aparecerá na tela</li>
          </ol>
        </div>
      </div>

      <p style={sectionLabelStyle}>Detecções recentes</p>
      {recentEntries.length === 0 ? (
        <p style={emptyRecentStyle}>Nada por aqui ainda — as palavras que você ouvir aparecem aqui.</p>
      ) : (
        <div style={recentListStyle}>
          {recentEntries.map((entry) => (
            <div key={entry.id} style={recentItemStyle}>
              <span style={recentTranslatedStyle}>{entry.translated}</span>
              <span style={recentOriginalStyle}>{entry.original}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const videoContainerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  background: "#000",
  overflow: "hidden",
};

const modelLoadingBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 13,
  padding: "6px 14px",
  borderRadius: 20,
};

const speakButtonStyle: CSSProperties = {
  position: "absolute",
  bottom: 24,
  left: 24,
  width: 52,
  height: 52,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(8px)",
  fontSize: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
};

const idlePageStyle: CSSProperties = {
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

const placeholderBoxStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "48px 20px",
  borderRadius: 20,
  border: `2px dashed ${COLOR_BORDER}`,
  marginBottom: 16,
};

const placeholderCircleStyle: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: GRADIENT_PRIMARY,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
};

const placeholderCaptionStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13, margin: 0 };
const errorDetailStyle: CSSProperties = {
  color: "#EF4444",
  fontSize: 12,
  margin: 0,
  textAlign: "center",
  maxWidth: 260,
};

const startButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  width: "100%",
  padding: "16px 0",
  borderRadius: 16,
  border: "none",
  background: GRADIENT_PRIMARY,
  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.28)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: 20,
};

const infoBoxStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  padding: 16,
  borderRadius: 16,
  background: "#EFF6FF",
  marginBottom: 24,
};

const infoTitleStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 6px",
};

const infoListStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 13,
  lineHeight: 1.7,
  margin: 0,
  paddingLeft: 18,
};

const sectionLabelStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 10px",
};

const emptyRecentStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 13 };

const recentListStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };

const recentItemStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: 12,
  borderRadius: 12,
  background: COLOR_SURFACE,
  border: `1px solid ${COLOR_BORDER}`,
};

const recentTranslatedStyle: CSSProperties = { color: COLOR_TEXT_PRIMARY, fontSize: 14, fontWeight: 700 };
const recentOriginalStyle: CSSProperties = { color: COLOR_TEXT_SECONDARY, fontSize: 12 };
