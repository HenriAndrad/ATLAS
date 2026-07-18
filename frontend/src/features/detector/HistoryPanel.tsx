import { useState, type CSSProperties } from "react";
import type { HistoryEntry } from "./useDetectionHistory";
import { ACCENT_COLOR } from "../../core/constants/appConstants";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function HistoryPanel({ entries, onToggleFavorite, onClose }: HistoryPanelProps) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const visibleEntries = showFavoritesOnly ? entries.filter((e) => e.favorite) : entries;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Histórico</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fechar histórico">
            ✕
          </button>
        </div>

        <button
          onClick={() => setShowFavoritesOnly((v) => !v)}
          style={{
            ...filterButtonStyle,
            background: showFavoritesOnly ? ACCENT_COLOR : "rgba(255, 255, 255, 0.1)",
          }}
        >
          {showFavoritesOnly ? "★ Só favoritos" : "☆ Só favoritos"}
        </button>

        {visibleEntries.length === 0 && (
          <p style={emptyStyle}>
            {showFavoritesOnly
              ? "Nenhuma palavra favoritada ainda."
              : "Nenhuma palavra ouvida ainda — toque no 🔊 na câmera."}
          </p>
        )}

        <ul style={listStyle}>
          {visibleEntries.map((entry) => (
            <li key={entry.id} style={itemStyle}>
              <div>
                <div style={translatedTextStyle}>{entry.translated}</div>
                <div style={originalTextStyle}>{entry.original}</div>
              </div>
              <button
                onClick={() => onToggleFavorite(entry.id)}
                style={heartButtonStyle}
                aria-label={entry.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {entry.favorite ? "❤️" : "🤍"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "flex-end",
  zIndex: 5,
};

const panelStyle: CSSProperties = {
  width: "100%",
  maxHeight: "70%",
  background: "#111",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  fontFamily: "system-ui, sans-serif",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const titleStyle: CSSProperties = { color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 };

const closeButtonStyle: CSSProperties = {
  border: "none",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  width: 32,
  height: 32,
  borderRadius: "50%",
  fontSize: 14,
  cursor: "pointer",
};

const filterButtonStyle: CSSProperties = {
  alignSelf: "flex-start",
  border: "none",
  borderRadius: 16,
  padding: "6px 14px",
  fontSize: 12,
  color: "#fff",
  cursor: "pointer",
};

const emptyStyle: CSSProperties = {
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: 13,
  textAlign: "center",
  padding: "24px 0",
};

const listStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 4px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const translatedTextStyle: CSSProperties = { color: "#fff", fontSize: 14, fontWeight: 600 };
const originalTextStyle: CSSProperties = { color: "rgba(255, 255, 255, 0.5)", fontSize: 12 };

const heartButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: 20,
  cursor: "pointer",
};
