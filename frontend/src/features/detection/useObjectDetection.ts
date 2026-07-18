import { useEffect, useRef, useState, type RefObject } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export interface DetectedObject {
  /** Nome da classe detectada, em inglês (vocabulário do modelo COCO). */
  class: string;
  /** Confiança da detecção, de 0 a 1. */
  score: number;
  /** [x, y, largura, altura] em pixels, nas dimensões nativas do vídeo. */
  bbox: [number, number, number, number];
}

export type ModelStatus = "loading" | "ready" | "error";

/// Carrega o modelo COCO-SSD uma vez e roda a detecção continuamente
/// sobre o elemento de vídeo enquanto ele estiver pronto.
///
/// Responsabilidade única: rodar a inferência e expor os resultados.
/// Não sabe nada sobre como desenhar as caixas — isso é do DetectionOverlay.
export function useObjectDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  isVideoReady: boolean,
) {
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const [status, setStatus] = useState<ModelStatus>("loading");
  const [detections, setDetections] = useState<DetectedObject[]>([]);

  // Carrega o modelo uma única vez.
  useEffect(() => {
    let cancelled = false;

    cocoSsd
      .load({ base: "lite_mobilenet_v2" }) // variante mais leve, prioriza velocidade
      .then((model) => {
        if (!cancelled) {
          modelRef.current = model;
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Loop de detecção: cada ciclo só começa depois que o anterior termina,
  // então a taxa de quadros se ajusta sozinha à velocidade do dispositivo
  // (em vez de acumular chamadas com setInterval).
  useEffect(() => {
    if (status !== "ready" || !isVideoReady) return;

    let active = true;
    let frameHandle: number;

    async function detectFrame() {
      const video = videoRef.current;
      const model = modelRef.current;

      if (active && video && model && video.readyState >= 2) {
        const predictions = await model.detect(video);
        if (active) {
          setDetections(
            predictions.map((p) => ({
              class: p.class,
              score: p.score,
              bbox: p.bbox as [number, number, number, number],
            })),
          );
        }
      }

      if (active) {
        frameHandle = requestAnimationFrame(detectFrame);
      }
    }

    detectFrame();

    return () => {
      active = false;
      cancelAnimationFrame(frameHandle);
    };
  }, [status, isVideoReady, videoRef]);

  return { status, detections };
}
