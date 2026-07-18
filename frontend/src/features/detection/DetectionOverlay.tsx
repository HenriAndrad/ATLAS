import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { DetectedObject } from "./useObjectDetection";

interface DetectionOverlayProps {
  detections: DetectedObject[];
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Mapa { rótulo original em inglês -> tradução }. */
  translations: Record<string, string>;
}

/// Desenha as caixas delimitadoras sobre o vídeo, com o nome traduzido em
/// destaque e o nome original + confiança como legenda secundária.
///
/// O vídeo usa `object-fit: cover`, então a imagem exibida é recortada e
/// escalada em relação à resolução nativa da câmera — este componente
/// converte as coordenadas do modelo (pixels nativos do vídeo) para
/// coordenadas de tela, replicando esse mesmo recorte/escala.
export function DetectionOverlay({ detections, videoRef, translations }: DetectionOverlayProps) {
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setContainerSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const video = videoRef.current;
  if (!video || video.videoWidth === 0) return null;

  const scale = Math.max(
    containerSize.width / video.videoWidth,
    containerSize.height / video.videoHeight,
  );
  const scaledWidth = video.videoWidth * scale;
  const scaledHeight = video.videoHeight * scale;
  const offsetX = (containerSize.width - scaledWidth) / 2;
  const offsetY = (containerSize.height - scaledHeight) / 2;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {detections.map((detection, index) => {
        const [x, y, w, h] = detection.bbox;
        const left = x * scale + offsetX;
        const top = y * scale + offsetY;
        const width = w * scale;
        const height = h * scale;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left,
              top,
              width,
              height,
              border: "2px solid #3B82F6",
              borderRadius: 8,
            }}
          >
            <div style={labelContainerStyle}>
              <span style={translatedLabelStyle}>
                {translations[detection.class] ?? detection.class}
              </span>
              <span style={originalLabelStyle}>
                {detection.class} · {(detection.score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const labelContainerStyle: CSSProperties = {
  position: "absolute",
  top: -46,
  left: 0,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  fontFamily: "system-ui, sans-serif",
  whiteSpace: "nowrap",
};

const translatedLabelStyle: CSSProperties = {
  background: "#3B82F6",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  padding: "3px 8px",
  borderRadius: 6,
  width: "fit-content",
};

const originalLabelStyle: CSSProperties = {
  background: "rgba(0, 0, 0, 0.6)",
  color: "#d1d5db",
  fontSize: 11,
  padding: "2px 8px",
  borderRadius: 6,
  width: "fit-content",
};
