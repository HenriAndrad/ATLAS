import { useEffect, useRef, useState } from "react";

export type CameraStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "denied"
  | "unavailable"
  | "error";

/// Encapsula o acesso à câmera do navegador via `getUserMedia`.
///
/// Responsabilidade única: obter o stream de vídeo e expor seu status.
/// Não sabe nada sobre layout ou UI — isso é responsabilidade de quem usa o hook.
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setStatus("requesting");
    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      return;
    }

    try {
      // facingMode "environment" com "ideal" (não "exact"): pede a câmera
      // traseira quando existir (celular), mas não falha em notebooks/desktops
      // que só têm uma webcam frontal.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("ready");
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setStatus("denied");
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setStatus("unavailable");
      } else {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido");
      }
    }
  };

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, status, errorMessage, start: startCamera, retry: startCamera };
}
