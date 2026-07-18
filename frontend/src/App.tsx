import { HashRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./features/home/HomeScreen";
import { DetectorScreen } from "./features/detector/DetectorScreen";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { LanguageLibraryScreen } from "./features/library/LanguageLibraryScreen";
import { VideosScreen } from "./features/videos/VideosScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { AdminScreen } from "./features/admin/AdminScreen";
import { BottomNav } from "./navigation/BottomNav";
import { useLanguageSelection } from "./features/settings/useLanguageSelection";

/// Componente raiz do app.
///
/// Usa HashRouter (não BrowserRouter) porque o GitHub Pages não suporta
/// redirecionar rotas arbitrárias para o index.html — o hash (#/rota)
/// nunca é enviado ao servidor, então funciona sem configuração extra.
function App() {
  const { targetLanguage, setTargetLanguage } = useLanguageSelection();

  return (
    <HashRouter>
      <div style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route
              path="/detector"
              element={
                <DetectorScreen
                  targetLanguage={targetLanguage}
                  onChangeLanguage={setTargetLanguage}
                />
              }
            />
            <Route path="/biblioteca" element={<LibraryScreen />} />
            <Route path="/biblioteca/:lang" element={<LanguageLibraryScreen />} />
            <Route path="/videos" element={<VideosScreen />} />
            <Route path="/perfil" element={<ProfileScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  );
}

export default App;
