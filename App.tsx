import { useEffect, useState } from "react";
import { APP_NAME } from "./core/constants/appConstants";

type BackendStatus = "checking" | "online" | "offline";

/// Componente raiz do app.
///
/// Etapa 1 escopo: apenas confirma que o setup (frontend + backend)
/// está funcionando ponta a ponta. Câmera, detecção, tradução etc.
/// entram nas próximas etapas — não implementados aqui de propósito.
function App() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/health")
      .then((res) => (res.ok ? setBackendStatus("online") : setBackendStatus("offline")))
      .catch(() => setBackendStatus("offline"));
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#fff",
        background: "#000",
        gap: 12,
      }}
    >
      <h1>{APP_NAME}</h1>
      <p>Frontend rodando.</p>
      <p>
        Backend:{" "}
        <strong style={{ color: backendStatus === "online" ? "#4ade80" : "#f87171" }}>
          {backendStatus === "checking" && "verificando..."}
          {backendStatus === "online" && "online ✅"}
          {backendStatus === "offline" && "offline — inicie o backend"}
        </strong>
      </p>
    </main>
  );
}

export default App;
