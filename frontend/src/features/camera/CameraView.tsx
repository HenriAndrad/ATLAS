import type { CSSProperties } from "react";
import { useCamera } from "./useCamera";
import { useObjectDetection } from "../detection/useObjectDetection";
import { DetectionOverlay } from "../detection/DetectionOverlay";
import { useTranslatedLabels } from "../translation/useTranslatedLabels";
import type { SupportedLanguage } from "../../core/constants/appConstants";

// TODO(etapa Configurações): trocar por um seletor de idioma escolhido
// pelo usuário. Por enquanto, fixo em português.
const TARGET_LANGUAGE: SupportedLanguage = "pt";

/// Tela principal: abre a câmera automaticamente e exibe o preview
/// preenchendo toda a área disponível (estilo Google Lens), sem
/// distorcer a imagem, com detecção de objetos e tradução em tempo real.
///
/// Etapa 4 escopo: preview + detecção + tradução do nome detectado.
/// Seletor de idioma, OCR e áudio entram em etapas futuras — não
/// implementados aqui de propósito.
export function CameraView() {
  const { videoRef, status, errorMessage, retry } = useCamera();
  const { status: modelStatus, detections } = useObjectDetection(
    videoRef,
    status === "ready",
  );
  const translations = useTranslatedLabels(
    detections.map((d) => d.class),
    TARGET_LANGUAGE,
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

const retryButtonStyle: CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  background: "#3B82F6",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
};
