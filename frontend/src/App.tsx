import { HashRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./features/home/HomeScreen";
import { DetectorScreen } from "./features/detector/DetectorScreen";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { LanguageLibraryScreen } from "./features/library/LanguageLibraryScreen";
import { VideosScreen } from "./features/videos/VideosScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { AdminScreen } from "./features/admin/AdminScreen";
import { LanguagesScreen } from "./features/languages/LanguagesScreen";
import { FavoritesScreen } from "./features/favorites/FavoritesScreen";
import { DictionaryScreen } from "./features/dictionary/DictionaryScreen";
import { SettingsScreen } from "./features/settings/SettingsScreen";
import { BottomNav } from "./navigation/BottomNav";
import { LanguageProvider } from "./core/context/LanguageContext";
import { AppSettingsProvider } from "./core/context/AppSettingsContext";
import { COLOR_BACKGROUND } from "./core/constants/appConstants";

/// Componente raiz do app.
///
/// Usa HashRouter (não BrowserRouter) porque o GitHub Pages não suporta
/// redirecionar rotas arbitrárias para o index.html — o hash (#/rota)
/// nunca é enviado ao servidor, então funciona sem configuração extra.
///
/// O idioma escolhido agora vive em LanguageProvider (Context), não mais
/// como prop repassada manualmente — isso permite que a tela de Idiomas
/// mude o idioma usado em qualquer lugar do app.
function App() {
  return (
    <AppSettingsProvider>
      <LanguageProvider>
        <HashRouter>
        <div
          style={{
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
            background: COLOR_BACKGROUND,
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/detector" element={<DetectorScreen />} />
              <Route path="/biblioteca" element={<LibraryScreen />} />
              <Route path="/biblioteca/:lang" element={<LanguageLibraryScreen />} />
              <Route path="/videos" element={<VideosScreen />} />
              <Route path="/perfil" element={<ProfileScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/idiomas" element={<LanguagesScreen />} />
              <Route path="/favoritos" element={<FavoritesScreen />} />
              <Route path="/dicionario" element={<DictionaryScreen />} />
              <Route path="/configuracoes" element={<SettingsScreen />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
        </HashRouter>
      </LanguageProvider>
    </AppSettingsProvider>
  );
}

export default App;
