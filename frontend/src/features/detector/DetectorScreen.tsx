import { useState, type CSSProperties } from "react";
import { CameraView } from "../camera/CameraView";
import { HistoryPanel } from "./HistoryPanel";
import { useDetectionHistory } from "./useDetectionHistory";
import { useLanguageContext } from "../../core/context/LanguageContext";

/// Aba "Detector": aponta a câmera para um objeto e vê a tradução em
/// tempo real, com histórico de palavras ouvidas e favoritos.
export function DetectorScreen() {
  const { targetLanguage, setTargetLanguage } = useLanguageContext();
  const { history, addEntry, toggleFavorite } = useDetectionHistory();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <CameraView
        targetLanguage={targetLanguage}
        onChangeLanguage={setTargetLanguage}
        onWordSpoken={(entry) => addEntry(entry.original, entry.translated, targetLanguage)}
      />

      <button
        onClick={() => setIsHistoryOpen(true)}
        style={historyButtonStyle}
        aria-label="Ver histórico de palavras"
      >
        📜
      </button>

      {isHistoryOpen && (
        <HistoryPanel
          entries={history}
          onToggleFavorite={toggleFavorite}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}

const historyButtonStyle: CSSProperties = {
  position: "absolute",
  bottom: 24,
  right: 24,
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
  cursor: "pointer",
};
