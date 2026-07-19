import type { CSSProperties } from "react";
import { useCamera } from "./useCamera";
import { useObjectDetection } from "../detection/useObjectDetection";
import { DetectionOverlay } from "../detection/DetectionOverlay";
import { getPrimaryDetection } from "../detection/getPrimaryDetection";
import { useTranslatedLabels } from "../translation/useTranslatedLabels";
import { LanguageSelector } from "../settings/LanguageSelector";
import { SpeakButton } from "../tts/SpeakButton";
import { speakText } from "../tts/speakText";
import { APP_NAME, GRADIENT_PRIMARY, MIN_CONFIDENT_LABEL_SCORE, type SupportedLanguage } from "../../core/constants/appConstants";

interface CameraViewProps {
  targetLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  /** Disparado sempre que o aluno toca no 🔊 para ouvir uma tradução. */
  onWordSpoken?: (entry: { original: string; translated: string }) => void;
}

/// Tela da câmera: mostra um botão "Iniciar câmera" e, depois de
/// acionado, exibe o preview preenchendo toda a área disponível
/// (estilo Google Lens), com detecção de objetos, tradução, seletor
/// de idioma e leitura em voz alta do objeto apontado.
///
/// Etapa 7 escopo: câmera sob demanda (não abre mais sozinha, já que
/// agora vive dentro da aba "Detector" da navegação). OCR entra em
/// etapa futura — não implementado aqui de propósito.
export function CameraView({ targetLanguage, onChangeLanguage, onWordSpoken }: CameraViewProps) {
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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {status === "idle" && (
        <div style={idleContainerStyle}>
          <span style={idleIconStyle}>📷</span>
          <p style={idleTextStyle}>
            Aponte a câmera para um objeto e veja a tradução em tempo real.
          </p>
          <button onClick={start} style={startButtonStyle}>
            Iniciar câmera
          </button>
        </div>
      )}

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

      {status === "ready" && (
        <SpeakButton
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
        />
      )}

      {status !== "ready" && status !== "idle" && (
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

const idleContainerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: 32,
  textAlign: "center",
  zIndex: 1,
};

const idleIconStyle: CSSProperties = {
  fontSize: 48,
};

const idleTextStyle: CSSProperties = {
  color: "rgba(255, 255, 255, 0.8)",
  fontFamily: "system-ui, sans-serif",
  fontSize: 15,
  maxWidth: 260,
};

const startButtonStyle: CSSProperties = {
  padding: "16px 32px",
  borderRadius: 28,
  border: "none",
  background: GRADIENT_PRIMARY,
  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

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
