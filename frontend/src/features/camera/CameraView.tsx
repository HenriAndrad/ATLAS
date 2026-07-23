import type { CSSProperties } from "react";
import { Camera as CameraIcon, Info } from "lucide-react";
import { useCamera } from "./useCamera";
import { useObjectDetection } from "../detection/useObjectDetection";
import { DetectionOverlay } from "../detection/DetectionOverlay";
import { getPrimaryDetection } from "../detection/getPrimaryDetection";
import { useStableDetection } from "../detection/useStableDetection";
import { useTranslatedLabels } from "../translation/useTranslatedLabels";
import { speakText } from "../tts/speakText";
import { useTranslation } from "../../core/i18n/useTranslation";
import { LanguageSelector } from "../settings/LanguageSelector";
import {
  ACCENT_COLOR,
  APP_NAME,
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
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onWordSpoken?: (entry: { original: string; translated: string }) => void;
  recentEntries?: RecentDetectionEntry[];
}

/// Tela do Detector. IMPORTANTE: o elemento <video> é SEMPRE renderizado
/// (só escondido com display:none quando não está em uso) — nunca deve
/// ser condicionado a `status === "ready"`, porque o srcObject é
/// atribuído a ele ANTES do status virar "ready". Se o <video> só
/// existisse condicionalmente, o stream seria atribuído a um elemento
/// que ainda não existe no DOM, e a tela ficaria preta (bug corrigido
/// nesta versão).
export function CameraView({ targetLanguage, onChangeLanguage, onWordSpoken, recentEntries = [] }: CameraViewProps) {
  const t = useTranslation();
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
  const stablePrimaryDetection = useStableDetection(primaryDetection);
  const isPrimaryConfident =
    stablePrimaryDetection !== null && stablePrimaryDetection.score >= MIN_CONFIDENT_LABEL_SCORE;
  const primaryTranslatedText =
    stablePrimaryDetection && isPrimaryConfident
      ? translations[stablePrimaryDetection.class] ?? stablePrimaryDetection.class
      : null;

  const statusCaption: Record<string, string> = {
    idle: t("detector.cameraOff"),
    requesting: t("detector.requesting"),
    denied: t("detector.denied"),
    unavailable: t("detector.unavailable"),
    error: t("detector.error"),
  };

  return (
    <div style={outerStyle}>
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
        <>
          <div style={topBarStyle}>
            <span style={appNameStyle}>{APP_NAME}</span>
            <LanguageSelector selected={targetLanguage} onSelect={onChangeLanguage} />
          </div>

          <DetectionOverlay detections={detections} videoRef={videoRef} translations={translations} />

          {modelStatus === "loading" && (
            <div style={{ ...modelLoadingBadgeStyle, top: 74 }}>Carregando modelo de detecção...</div>
          )}

          <button
            disabled={!primaryTranslatedText}
            onClick={() => {
              if (primaryTranslatedText && stablePrimaryDetection) {
                speakText(primaryTranslatedText, targetLanguage);
                onWordSpoken?.({
                  original: stablePrimaryDetection.class,
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
        </>
      )}

      {status !== "ready" && (
        <div style={idlePageStyle}>
          <div style={idleTopBarStyle}>
            <span style={idleAppNameStyle}>{APP_NAME}</span>
            <LanguageSelector selected={targetLanguage} onSelect={onChangeLanguage} />
          </div>

          <h1 style={titleStyle}>{t("detector.title")}</h1>
          <p style={subtitleStyle}>{t("detector.subtitle")}</p>

          <div style={placeholderBoxStyle}>
            <div style={placeholderCircleStyle}>
              <CameraIcon size={30} color="#fff" strokeWidth={2} />
            </div>
            <p style={placeholderCaptionStyle}>{statusCaption[status]}</p>
            {status === "error" && errorMessage && <p style={errorDetailStyle}>{errorMessage}</p>}
          </div>

          {(status === "idle" || status === "denied") && (
            <button onClick={status === "denied" ? retry : start} style={startButtonStyle}>
              <CameraIcon size={18} color="#fff" />
              {status === "denied" ? t("detector.allowAccess") : t("detector.openCamera")}
            </button>
          )}

          <div style={infoBoxStyle}>
            <Info size={18} color={ACCENT_COLOR} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={infoTitleStyle}>{t("detector.howToUse")}</p>
              <ol style={infoListStyle}>
                <li>{t("detector.step1")}</li>
                <li>{t("detector.step2")}</li>
                <li>{t("detector.step3")}</li>
              </ol>
            </div>
          </div>

          <p style={sectionLabelStyle}>{t("detector.recent")}</p>
          {recentEntries.length === 0 ? (
            <p style={emptyRecentStyle}>{t("detector.recentEmpty")}</p>
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
  fontWeight: 700,
  letterSpacing: 0.2,
};

const idleTopBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
};

const idleAppNameStyle: CSSProperties = {
  color: COLOR_TEXT_PRIMARY,
  fontFamily: "system-ui, sans-serif",
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: 0.3,
};

const outerStyle: CSSProperties = {
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
  position: "absolute",
  inset: 0,
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
