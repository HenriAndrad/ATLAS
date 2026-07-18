import type { CSSProperties } from "react";
import { useCamera } from "./useCamera";

/// Tela principal: abre a câmera automaticamente e exibe o preview
/// preenchendo toda a área disponível (estilo Google Lens), sem
/// distorcer a imagem.
///
/// Etapa 2 escopo: apenas o preview da câmera. Detecção de objetos e
/// overlay de tradução entram na próxima etapa — não implementados
/// aqui de propósito.
export function CameraView() {
  const { videoRef, status, errorMessage, retry } = useCamera();

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

const retryButtonStyle: CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  background: "#3B82F6",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
};
