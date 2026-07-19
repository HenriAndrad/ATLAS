import { useState } from "react";
import { CameraView } from "../camera/CameraView";
import { HistoryPanel } from "./HistoryPanel";
import { useDetectionHistory } from "./useDetectionHistory";
import { useLanguageContext } from "../../core/context/LanguageContext";

/// Aba "Detector": aponta a câmera para um objeto e vê a tradução em
/// tempo real, com histórico de palavras ouvidas e favoritos.
export function DetectorScreen() {
  const { targetLanguage } = useLanguageContext();
  const { history, addEntry, toggleFavorite } = useDetectionHistory();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <CameraView
        targetLanguage={targetLanguage}
        onWordSpoken={(entry) => addEntry(entry.original, entry.translated, targetLanguage)}
        recentEntries={history.slice(0, 3)}
      />

      {history.length > 0 && (
        <button
          onClick={() => setIsHistoryOpen(true)}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: "rgba(17, 24, 39, 0.08)",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Ver histórico completo"
        >
          📜
        </button>
      )}

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
