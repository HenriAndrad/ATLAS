import type { CSSProperties } from "react";
import { useCamera } from "./useCamera";
import { useObjectDetection } from "../detection/useObjectDetection";
import { DetectionOverlay } from "../detection/DetectionOverlay";
import { useTranslatedLabels } from "../translation/useTranslatedLabels";
import { LanguageSelector } from "../settings/LanguageSelector";
import { APP_NAME, type SupportedLanguage } from "../../core/constants/appConstants";

interface CameraViewProps {
  targetLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

/// Tela principal: abre a câmera automaticamente e exibe o preview
/// preenchendo toda a área disponível (estilo Google Lens), sem
/// distorcer a imagem, com detecção de objetos, tradução e seletor
/// de idioma em tempo real.
///
/// Etapa 5 escopo: preview + detecção + tradução + seletor de idioma
/// + barra superior. OCR e áudio entram em etapas futuras — não
/// implementados aqui de propósito.
export function CameraView({ targetLanguage, onChangeLanguage }: CameraViewProps) {
  const { videoRef, status, errorMessage, retry } = useCamera();
  const { status: modelStatus, detections } = useObjectDetection(
    videoRef,
    status === "ready",
  );
  const translations = useTranslatedLabels(
    detections.map((d) => d.class),
    targetLanguage,
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: status === "ready" ? "block" : "none",
        }}
      />

      {status === "ready" && (
        <div style={topBarStyle}>
          <span style={appNameStyle}>{APP_NAME}</span>
          <LanguageSelector selected={targetLanguage} onSelect={onChangeLanguage} />
        </div>
      )}

      {status === "ready" && (
        <DetectionOverlay
          detections={detections}
          videoRef={videoRef}
          translations={translations}
        />
      )}

      {status === "ready" && modelStatus === "loading" && (
        <div style={modelLoadingBadgeStyle}>Carregando modelo de detecção...</div>
      )}

      {status !== "ready" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          {status === "requesting" && <p>Solicitando acesso à câmera...</p>}

          {status === "denied" && (
            <>
              <p>Precisamos de acesso à câmera para traduzir o que você vê.</p>
              <button onClick={retry} style={retryButtonStyle}>
                Permitir acesso
              </button>
            </>
          )}

          {status === "unavailable" && (
            <p>Nenhuma câmera encontrada neste dispositivo.</p>
          )}

          {status === "error" && (
            <p>
              Erro ao acessar a câmera.
              {errorMessage ? ` (${errorMessage})` : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const topBarStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 16px 44px",
  background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0))",
  zIndex: 2,
};

const appNameStyle: CSSProperties = {
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.2,
};

const modelLoadingBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 64,
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 13,
  padding: "6px 14px",
  borderRadius: 20,
};

const retryButtonStyle: CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  background: "#3B82F6",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
};
