import type { DetectedObject } from "./useObjectDetection";

/// Retorna o objeto detectado cujo centro está mais próximo do centro
/// do vídeo — ou seja, o objeto que a câmera está "apontando" no momento,
/// e não qualquer outro que apareça nas bordas do quadro.
export function getPrimaryDetection(
  detections: DetectedObject[],
  video: HTMLVideoElement | null,
): DetectedObject | null {
  if (!video || video.videoWidth === 0 || detections.length === 0) return null;

  const centerX = video.videoWidth / 2;
  const centerY = video.videoHeight / 2;

  let closest = detections[0];
  let closestDistance = Infinity;

  for (const detection of detections) {
    const [x, y, w, h] = detection.bbox;
    const boxCenterX = x + w / 2;
    const boxCenterY = y + h / 2;
    const distance = Math.hypot(boxCenterX - centerX, boxCenterY - centerY);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = detection;
    }
  }

  return closest;
}
