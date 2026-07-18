import type { CSSProperties } from "react";

interface SpeakButtonProps {
  onClick: () => void;
  disabled: boolean;
}

/// Botão flutuante 🔊 no canto inferior esquerdo. Fica desabilitado
/// (mais apagado) quando não há nenhum objeto detectado no momento.
export function SpeakButton({ onClick, disabled }: SpeakButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Ouvir tradução do objeto apontado"
      style={{
        ...buttonStyle,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      🔊
    </button>
  );
}

const buttonStyle: CSSProperties = {
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
