import type { CSSProperties } from "react";
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from "../../core/constants/appConstants";

/// Aba "Vídeos": lista vídeos educacionais (aulas, dicas, desafios).
///
/// Etapa atual: só o estado vazio. A estrutura de dados (ver types.ts)
/// já está pronta para receber vídeos do YouTube quando a integração
/// for implementada — essa tela só precisa passar a mapear uma lista
/// de VideoContent[] em vez de mostrar o estado vazio.
export function VideosScreen() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Vídeos</h1>
      <p style={subtitleStyle}>Aulas, dicas e desafios de idiomas</p>

      <div style={emptyStateStyle}>
        <span style={emptyIconStyle}>🎬</span>
        <p style={emptyTextStyle}>
          Em breve: aulas e dicas em vídeo pra complementar seu aprendizado.
        </p>
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: 20,
  paddingBottom: 96,
  color: COLOR_TEXT_PRIMARY,
  fontFamily: "system-ui, sans-serif",
  height: "100%",
  overflowY: "auto",
  background: COLOR_BACKGROUND,
};

const titleStyle: CSSProperties = { fontSize: 24, fontWeight: 700, margin: 0 };
const subtitleStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 14,
  marginTop: 4,
  marginBottom: 20,
};

const emptyStateStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: "48px 24px",
  borderRadius: 16,
  border: `1px dashed ${COLOR_BORDER}`,
  textAlign: "center",
};

const emptyIconStyle: CSSProperties = { fontSize: 40 };
const emptyTextStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  fontSize: 14,
  maxWidth: 240,
};
