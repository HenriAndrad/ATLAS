import { HashRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./features/home/HomeScreen";
import { DetectorScreen } from "./features/detector/DetectorScreen";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { CategoryLibraryScreen } from "./features/library/CategoryLibraryScreen";
import { VideosScreen } from "./features/videos/VideosScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { LanguagesScreen } from "./features/languages/LanguagesScreen";
import { FavoritesScreen } from "./features/favorites/FavoritesScreen";
import { DictionaryScreen } from "./features/dictionary/DictionaryScreen";
import { SettingsScreen } from "./features/settings/SettingsScreen";
import { LoginScreen } from "./features/auth/LoginScreen";
import { BottomNav } from "./navigation/BottomNav";
import { LanguageProvider } from "./core/context/LanguageContext";
import { AppSettingsProvider } from "./core/context/AppSettingsContext";
import { AuthProvider, useAuth } from "./core/auth/AuthContext";
import { COLOR_BACKGROUND } from "./core/constants/appConstants";

/// Conteúdo do app depois de autenticado — a navegação e as telas de
/// sempre. Só existe pra quem já fez login/cadastro.
function AuthenticatedApp() {
  return (
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
            <Route path="/biblioteca/categoria/:categoryId" element={<CategoryLibraryScreen />} />
            <Route path="/videos" element={<VideosScreen />} />
            <Route path="/perfil" element={<ProfileScreen />} />
            <Route path="/idiomas" element={<LanguagesScreen />} />
            <Route path="/favoritos" element={<FavoritesScreen />} />
            <Route path="/dicionario" element={<DictionaryScreen />} />
            <Route path="/configuracoes" element={<SettingsScreen />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  );
}

/// Decide entre a tela de login e o app de verdade, com base no estado
/// de autenticação. Nada do conteúdo do ATLAS aparece antes do login.
function Gate() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLOR_BACKGROUND,
        }}
      />
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <AppSettingsProvider>
      <LanguageProvider>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </LanguageProvider>
    </AppSettingsProvider>
  );
}

export default App;
