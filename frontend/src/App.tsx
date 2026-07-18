import { CameraView } from "./features/camera/CameraView";
import { useLanguageSelection } from "./features/settings/useLanguageSelection";

/// Componente raiz do app.
///
/// Gerencia o idioma de destino (persistido no navegador) e repassa
/// para a câmera, que é a tela principal do app.
function App() {
  const { targetLanguage, setTargetLanguage } = useLanguageSelection();

  return (
    <CameraView targetLanguage={targetLanguage} onChangeLanguage={setTargetLanguage} />
  );
}

export default App;
