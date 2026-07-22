import type { SupportedLanguage } from "../constants/appConstants";

export type TranslationKey =
  | "nav.home"
  | "nav.library"
  | "nav.favorites"
  | "nav.profile"
  | "home.greeting"
  | "home.title"
  | "home.bannerTitle"
  | "home.bannerText"
  | "home.shortcuts"
  | "shortcut.library"
  | "shortcut.librarySubtitle"
  | "shortcut.detector"
  | "shortcut.detectorSubtitle"
  | "shortcut.dictionary"
  | "shortcut.dictionarySubtitle"
  | "shortcut.favorites"
  | "shortcut.favoritesSubtitle"
  | "shortcut.languages"
  | "shortcut.languagesSubtitle"
  | "shortcut.videos"
  | "shortcut.videosSubtitle"
  | "shortcut.settings"
  | "shortcut.settingsSubtitle"
  | "detector.title"
  | "detector.subtitle"
  | "detector.cameraOff"
  | "detector.requesting"
  | "detector.denied"
  | "detector.unavailable"
  | "detector.error"
  | "detector.openCamera"
  | "detector.allowAccess"
  | "detector.howToUse"
  | "detector.step1"
  | "detector.step2"
  | "detector.step3"
  | "detector.recent"
  | "detector.recentEmpty"
  | "languages.title"
  | "languages.subtitle"
  | "languages.note"
  | "favorites.title"
  | "favorites.subtitle"
  | "favorites.words"
  | "favorites.contents"
  | "favorites.emptyWords"
  | "favorites.emptyContents"
  | "settings.title"
  | "settings.subtitle"
  | "settings.language"
  | "settings.theme"
  | "settings.themeLight"
  | "settings.fontSize"
  | "settings.notifications"
  | "settings.dailyReminders"
  | "settings.sounds"
  | "settings.accessibility"
  | "settings.highContrast"
  | "dictionary.title"
  | "dictionary.subtitle"
  | "dictionary.search"
  | "dictionary.empty";

type Dictionary = Record<TranslationKey, string>;

const pt: Dictionary = {
  "nav.home": "Início",
  "nav.library": "Biblioteca",
  "nav.favorites": "Favoritos",
  "nav.profile": "Perfil",
  "home.greeting": "Olá!",
  "home.title": "Bem-vindo ao ATLAS",
  "home.bannerTitle": "Aprenda apontando a câmera",
  "home.bannerText":
    "Com o ATLAS você identifica objetos ao seu redor e aprende o nome deles em outro idioma na hora, com tradução, pronúncia e exemplos de frases.",
  "home.shortcuts": "Atalhos",
  "shortcut.library": "Biblioteca",
  "shortcut.librarySubtitle": "Conteúdos escolares",
  "shortcut.detector": "Detector",
  "shortcut.detectorSubtitle": "Identificar palavras",
  "shortcut.dictionary": "Dicionário",
  "shortcut.dictionarySubtitle": "Traduções",
  "shortcut.favorites": "Favoritos",
  "shortcut.favoritesSubtitle": "Itens salvos",
  "shortcut.languages": "Idiomas",
  "shortcut.languagesSubtitle": "6 idiomas",
  "shortcut.videos": "Vídeos",
  "shortcut.videosSubtitle": "Aulas e dicas",
  "shortcut.settings": "Ajustes",
  "shortcut.settingsSubtitle": "Preferências",
  "detector.title": "Detector de Palavras",
  "detector.subtitle": "Aponte a câmera para identificar e traduzir palavras",
  "detector.cameraOff": "Câmera desativada",
  "detector.requesting": "Solicitando acesso...",
  "detector.denied": "Acesso à câmera negado",
  "detector.unavailable": "Nenhuma câmera encontrada",
  "detector.error": "Erro ao acessar a câmera",
  "detector.openCamera": "Abrir Câmera",
  "detector.allowAccess": "Permitir acesso",
  "detector.howToUse": "Como usar",
  "detector.step1": 'Toque em "Abrir Câmera"',
  "detector.step2": "Aponte para uma palavra ou objeto",
  "detector.step3": "A tradução aparecerá na tela",
  "detector.recent": "Detecções recentes",
  "detector.recentEmpty": "Nada por aqui ainda — as palavras que você ouvir aparecem aqui.",
  "languages.title": "Idiomas",
  "languages.subtitle": "Selecione seu idioma principal",
  "languages.note": "Novos idiomas podem ser adicionados pelo administrador.",
  "favorites.title": "Favoritos",
  "favorites.subtitle": "Palavras e conteúdos salvos",
  "favorites.words": "Palavras",
  "favorites.contents": "Conteúdos",
  "favorites.emptyWords": "Nenhuma palavra favoritada ainda — toque no 🤍 no histórico do Detector.",
  "favorites.emptyContents": "Favoritar conteúdos da Biblioteca ainda não está disponível.",
  "settings.title": "Configurações",
  "settings.subtitle": "Personalize sua experiência",
  "settings.language": "Idioma",
  "settings.theme": "Tema",
  "settings.themeLight": "Modo Claro",
  "settings.fontSize": "Tamanho da fonte",
  "settings.notifications": "Notificações",
  "settings.dailyReminders": "Lembretes diários",
  "settings.sounds": "Sons",
  "settings.accessibility": "Acessibilidade",
  "settings.highContrast": "Alto contraste",
  "dictionary.title": "Dicionário",
  "dictionary.subtitle": "Palavras mais comuns no idioma escolhido",
  "dictionary.search": "Buscar palavra...",
  "dictionary.empty": "Nenhuma palavra encontrada.",
};

const en: Dictionary = {
  "nav.home": "Home",
  "nav.library": "Library",
  "nav.favorites": "Favorites",
  "nav.profile": "Profile",
  "home.greeting": "Hello!",
  "home.title": "Welcome to ATLAS",
  "home.bannerTitle": "Learn by pointing the camera",
  "home.bannerText":
    "With ATLAS you identify objects around you and instantly learn their name in another language, with translation, pronunciation and example sentences.",
  "home.shortcuts": "Shortcuts",
  "shortcut.library": "Library",
  "shortcut.librarySubtitle": "School content",
  "shortcut.detector": "Detector",
  "shortcut.detectorSubtitle": "Identify words",
  "shortcut.dictionary": "Dictionary",
  "shortcut.dictionarySubtitle": "Translations",
  "shortcut.favorites": "Favorites",
  "shortcut.favoritesSubtitle": "Saved items",
  "shortcut.languages": "Languages",
  "shortcut.languagesSubtitle": "6 languages",
  "shortcut.videos": "Videos",
  "shortcut.videosSubtitle": "Lessons and tips",
  "shortcut.settings": "Settings",
  "shortcut.settingsSubtitle": "Preferences",
  "detector.title": "Word Detector",
  "detector.subtitle": "Point the camera to identify and translate words",
  "detector.cameraOff": "Camera off",
  "detector.requesting": "Requesting access...",
  "detector.denied": "Camera access denied",
  "detector.unavailable": "No camera found",
  "detector.error": "Error accessing the camera",
  "detector.openCamera": "Open Camera",
  "detector.allowAccess": "Allow access",
  "detector.howToUse": "How to use",
  "detector.step1": 'Tap "Open Camera"',
  "detector.step2": "Point at a word or object",
  "detector.step3": "The translation will appear on screen",
  "detector.recent": "Recent detections",
  "detector.recentEmpty": "Nothing here yet — words you hear will show up here.",
  "languages.title": "Languages",
  "languages.subtitle": "Select your main language",
  "languages.note": "New languages can be added by the administrator.",
  "favorites.title": "Favorites",
  "favorites.subtitle": "Saved words and content",
  "favorites.words": "Words",
  "favorites.contents": "Content",
  "favorites.emptyWords": "No favorited words yet — tap 🤍 in the Detector history.",
  "favorites.emptyContents": "Favoriting Library content isn't available yet.",
  "settings.title": "Settings",
  "settings.subtitle": "Personalize your experience",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.themeLight": "Light Mode",
  "settings.fontSize": "Font size",
  "settings.notifications": "Notifications",
  "settings.dailyReminders": "Daily reminders",
  "settings.sounds": "Sounds",
  "settings.accessibility": "Accessibility",
  "settings.highContrast": "High contrast",
  "dictionary.title": "Dictionary",
  "dictionary.subtitle": "Most common words in the chosen language",
  "dictionary.search": "Search a word...",
  "dictionary.empty": "No words found.",
};

const es: Dictionary = {
  "nav.home": "Inicio",
  "nav.library": "Biblioteca",
  "nav.favorites": "Favoritos",
  "nav.profile": "Perfil",
  "home.greeting": "¡Hola!",
  "home.title": "Bienvenido a ATLAS",
  "home.bannerTitle": "Aprende apuntando la cámara",
  "home.bannerText":
    "Con ATLAS identificas objetos a tu alrededor y aprendes su nombre en otro idioma al instante, con traducción, pronunciación y ejemplos de frases.",
  "home.shortcuts": "Accesos rápidos",
  "shortcut.library": "Biblioteca",
  "shortcut.librarySubtitle": "Contenidos escolares",
  "shortcut.detector": "Detector",
  "shortcut.detectorSubtitle": "Identificar palabras",
  "shortcut.dictionary": "Diccionario",
  "shortcut.dictionarySubtitle": "Traducciones",
  "shortcut.favorites": "Favoritos",
  "shortcut.favoritesSubtitle": "Elementos guardados",
  "shortcut.languages": "Idiomas",
  "shortcut.languagesSubtitle": "6 idiomas",
  "shortcut.videos": "Vídeos",
  "shortcut.videosSubtitle": "Clases y consejos",
  "shortcut.settings": "Ajustes",
  "shortcut.settingsSubtitle": "Preferencias",
  "detector.title": "Detector de Palabras",
  "detector.subtitle": "Apunta la cámara para identificar y traducir palabras",
  "detector.cameraOff": "Cámara desactivada",
  "detector.requesting": "Solicitando acceso...",
  "detector.denied": "Acceso a la cámara denegado",
  "detector.unavailable": "No se encontró ninguna cámara",
  "detector.error": "Error al acceder a la cámara",
  "detector.openCamera": "Abrir Cámara",
  "detector.allowAccess": "Permitir acceso",
  "detector.howToUse": "Cómo usar",
  "detector.step1": 'Toca "Abrir Cámara"',
  "detector.step2": "Apunta a una palabra u objeto",
  "detector.step3": "La traducción aparecerá en pantalla",
  "detector.recent": "Detecciones recientes",
  "detector.recentEmpty": "Nada por aquí todavía — las palabras que escuches aparecerán aquí.",
  "languages.title": "Idiomas",
  "languages.subtitle": "Selecciona tu idioma principal",
  "languages.note": "El administrador puede añadir nuevos idiomas.",
  "favorites.title": "Favoritos",
  "favorites.subtitle": "Palabras y contenidos guardados",
  "favorites.words": "Palabras",
  "favorites.contents": "Contenidos",
  "favorites.emptyWords": "Ninguna palabra favorita todavía — toca 🤍 en el historial del Detector.",
  "favorites.emptyContents": "Marcar contenidos de la Biblioteca aún no está disponible.",
  "settings.title": "Configuración",
  "settings.subtitle": "Personaliza tu experiencia",
  "settings.language": "Idioma",
  "settings.theme": "Tema",
  "settings.themeLight": "Modo Claro",
  "settings.fontSize": "Tamaño de fuente",
  "settings.notifications": "Notificaciones",
  "settings.dailyReminders": "Recordatorios diarios",
  "settings.sounds": "Sonidos",
  "settings.accessibility": "Accesibilidad",
  "settings.highContrast": "Alto contraste",
  "dictionary.title": "Diccionario",
  "dictionary.subtitle": "Palabras más comunes en el idioma elegido",
  "dictionary.search": "Buscar palabra...",
  "dictionary.empty": "No se encontraron palabras.",
};

const de: Dictionary = {
  "nav.home": "Start",
  "nav.library": "Bibliothek",
  "nav.favorites": "Favoriten",
  "nav.profile": "Profil",
  "home.greeting": "Hallo!",
  "home.title": "Willkommen bei ATLAS",
  "home.bannerTitle": "Lerne, indem du die Kamera richtest",
  "home.bannerText":
    "Mit ATLAS erkennst du Objekte um dich herum und lernst sofort ihren Namen in einer anderen Sprache — mit Übersetzung, Aussprache und Beispielsätzen.",
  "home.shortcuts": "Schnellzugriff",
  "shortcut.library": "Bibliothek",
  "shortcut.librarySubtitle": "Schulinhalte",
  "shortcut.detector": "Detektor",
  "shortcut.detectorSubtitle": "Wörter erkennen",
  "shortcut.dictionary": "Wörterbuch",
  "shortcut.dictionarySubtitle": "Übersetzungen",
  "shortcut.favorites": "Favoriten",
  "shortcut.favoritesSubtitle": "Gespeicherte Elemente",
  "shortcut.languages": "Sprachen",
  "shortcut.languagesSubtitle": "6 Sprachen",
  "shortcut.videos": "Videos",
  "shortcut.videosSubtitle": "Lektionen und Tipps",
  "shortcut.settings": "Einstellungen",
  "shortcut.settingsSubtitle": "Präferenzen",
  "detector.title": "Wort-Detektor",
  "detector.subtitle": "Richte die Kamera, um Wörter zu erkennen und zu übersetzen",
  "detector.cameraOff": "Kamera deaktiviert",
  "detector.requesting": "Zugriff wird angefragt...",
  "detector.denied": "Kamerazugriff verweigert",
  "detector.unavailable": "Keine Kamera gefunden",
  "detector.error": "Fehler beim Zugriff auf die Kamera",
  "detector.openCamera": "Kamera öffnen",
  "detector.allowAccess": "Zugriff erlauben",
  "detector.howToUse": "So funktioniert's",
  "detector.step1": 'Tippe auf "Kamera öffnen"',
  "detector.step2": "Richte sie auf ein Wort oder Objekt",
  "detector.step3": "Die Übersetzung erscheint auf dem Bildschirm",
  "detector.recent": "Letzte Erkennungen",
  "detector.recentEmpty": "Hier ist noch nichts — Wörter, die du hörst, erscheinen hier.",
  "languages.title": "Sprachen",
  "languages.subtitle": "Wähle deine Hauptsprache",
  "languages.note": "Neue Sprachen können vom Administrator hinzugefügt werden.",
  "favorites.title": "Favoriten",
  "favorites.subtitle": "Gespeicherte Wörter und Inhalte",
  "favorites.words": "Wörter",
  "favorites.contents": "Inhalte",
  "favorites.emptyWords": "Noch keine favorisierten Wörter — tippe auf 🤍 im Detektor-Verlauf.",
  "favorites.emptyContents": "Bibliotheksinhalte favorisieren ist noch nicht verfügbar.",
  "settings.title": "Einstellungen",
  "settings.subtitle": "Personalisiere deine Erfahrung",
  "settings.language": "Sprache",
  "settings.theme": "Design",
  "settings.themeLight": "Heller Modus",
  "settings.fontSize": "Schriftgröße",
  "settings.notifications": "Benachrichtigungen",
  "settings.dailyReminders": "Tägliche Erinnerungen",
  "settings.sounds": "Töne",
  "settings.accessibility": "Barrierefreiheit",
  "settings.highContrast": "Hoher Kontrast",
  "dictionary.title": "Wörterbuch",
  "dictionary.subtitle": "Häufigste Wörter in der gewählten Sprache",
  "dictionary.search": "Wort suchen...",
  "dictionary.empty": "Keine Wörter gefunden.",
};

const fr: Dictionary = {
  "nav.home": "Accueil",
  "nav.library": "Bibliothèque",
  "nav.favorites": "Favoris",
  "nav.profile": "Profil",
  "home.greeting": "Salut !",
  "home.title": "Bienvenue sur ATLAS",
  "home.bannerTitle": "Apprends en pointant la caméra",
  "home.bannerText":
    "Avec ATLAS, tu identifies les objets autour de toi et apprends aussitôt leur nom dans une autre langue, avec traduction, prononciation et exemples de phrases.",
  "home.shortcuts": "Raccourcis",
  "shortcut.library": "Bibliothèque",
  "shortcut.librarySubtitle": "Contenus scolaires",
  "shortcut.detector": "Détecteur",
  "shortcut.detectorSubtitle": "Identifier des mots",
  "shortcut.dictionary": "Dictionnaire",
  "shortcut.dictionarySubtitle": "Traductions",
  "shortcut.favorites": "Favoris",
  "shortcut.favoritesSubtitle": "Éléments enregistrés",
  "shortcut.languages": "Langues",
  "shortcut.languagesSubtitle": "6 langues",
  "shortcut.videos": "Vidéos",
  "shortcut.videosSubtitle": "Cours et astuces",
  "shortcut.settings": "Réglages",
  "shortcut.settingsSubtitle": "Préférences",
  "detector.title": "Détecteur de Mots",
  "detector.subtitle": "Pointe la caméra pour identifier et traduire des mots",
  "detector.cameraOff": "Caméra désactivée",
  "detector.requesting": "Demande d'accès...",
  "detector.denied": "Accès à la caméra refusé",
  "detector.unavailable": "Aucune caméra trouvée",
  "detector.error": "Erreur d'accès à la caméra",
  "detector.openCamera": "Ouvrir la Caméra",
  "detector.allowAccess": "Autoriser l'accès",
  "detector.howToUse": "Comment utiliser",
  "detector.step1": 'Appuie sur "Ouvrir la Caméra"',
  "detector.step2": "Pointe vers un mot ou un objet",
  "detector.step3": "La traduction apparaîtra à l'écran",
  "detector.recent": "Détections récentes",
  "detector.recentEmpty": "Rien ici pour l'instant — les mots que tu écoutes apparaîtront ici.",
  "languages.title": "Langues",
  "languages.subtitle": "Choisis ta langue principale",
  "languages.note": "De nouvelles langues peuvent être ajoutées par l'administrateur.",
  "favorites.title": "Favoris",
  "favorites.subtitle": "Mots et contenus enregistrés",
  "favorites.words": "Mots",
  "favorites.contents": "Contenus",
  "favorites.emptyWords": "Aucun mot favori pour l'instant — appuie sur 🤍 dans l'historique du Détecteur.",
  "favorites.emptyContents": "Mettre en favori le contenu de la Bibliothèque n'est pas encore disponible.",
  "settings.title": "Réglages",
  "settings.subtitle": "Personnalise ton expérience",
  "settings.language": "Langue",
  "settings.theme": "Thème",
  "settings.themeLight": "Mode Clair",
  "settings.fontSize": "Taille du texte",
  "settings.notifications": "Notifications",
  "settings.dailyReminders": "Rappels quotidiens",
  "settings.sounds": "Sons",
  "settings.accessibility": "Accessibilité",
  "settings.highContrast": "Contraste élevé",
  "dictionary.title": "Dictionnaire",
  "dictionary.subtitle": "Mots les plus courants dans la langue choisie",
  "dictionary.search": "Rechercher un mot...",
  "dictionary.empty": "Aucun mot trouvé.",
};

// Aviso: traduções em Crioulo Haitiano feitas com o melhor esforço
// possível para termos de interface simples. Diferente do resto do
// app, isso NÃO passou pela DeepL (que tem suporte limitado a esse
// idioma) — recomendo revisão por um falante nativo antes de considerar
// definitivo.
const ht: Dictionary = {
  "nav.home": "Akèy",
  "nav.library": "Bibliyotèk",
  "nav.favorites": "Favori",
  "nav.profile": "Pwofil",
  "home.greeting": "Bonjou!",
  "home.title": "Byenveni nan ATLAS",
  "home.bannerTitle": "Aprann lè w pwente kamera a",
  "home.bannerText":
    "Avèk ATLAS ou idantifye objè ki antoure w epi ou aprann non yo nan yon lòt lang imedyatman, ak tradiksyon, pwononsyasyon ak egzanp fraz.",
  "home.shortcuts": "Rakousi",
  "shortcut.library": "Bibliyotèk",
  "shortcut.librarySubtitle": "Kontni lekòl",
  "shortcut.detector": "Detektè",
  "shortcut.detectorSubtitle": "Idantifye mo",
  "shortcut.dictionary": "Diksyonè",
  "shortcut.dictionarySubtitle": "Tradiksyon",
  "shortcut.favorites": "Favori",
  "shortcut.favoritesSubtitle": "Eleman anrejistre",
  "shortcut.languages": "Lang",
  "shortcut.languagesSubtitle": "6 lang",
  "shortcut.videos": "Videyo",
  "shortcut.videosSubtitle": "Leson ak konsèy",
  "shortcut.settings": "Paramèt",
  "shortcut.settingsSubtitle": "Preferans",
  "detector.title": "Detektè Mo",
  "detector.subtitle": "Pwente kamera a pou idantifye ak tradui mo",
  "detector.cameraOff": "Kamera etenn",
  "detector.requesting": "N ap mande aksè...",
  "detector.denied": "Aksè kamera refize",
  "detector.unavailable": "Pa gen kamera ki jwenn",
  "detector.error": "Erè pandan aksè a kamera a",
  "detector.openCamera": "Ouvri Kamera",
  "detector.allowAccess": "Otorize aksè",
  "detector.howToUse": "Kijan pou itilize",
  "detector.step1": 'Peze "Ouvri Kamera"',
  "detector.step2": "Pwente sou yon mo oswa yon objè",
  "detector.step3": "Tradiksyon an ap parèt sou ekran an",
  "detector.recent": "Deteksyon resan",
  "detector.recentEmpty": "Poko gen anyen isit la — mo ou tande yo ap parèt isit la.",
  "languages.title": "Lang",
  "languages.subtitle": "Chwazi lang prensipal ou",
  "languages.note": "Administratè a ka ajoute nouvo lang.",
  "favorites.title": "Favori",
  "favorites.subtitle": "Mo ak kontni anrejistre",
  "favorites.words": "Mo",
  "favorites.contents": "Kontni",
  "favorites.emptyWords": "Poko gen mo favori — peze 🤍 nan istwa Detektè a.",
  "favorites.emptyContents": "Mete kontni Bibliyotèk kòm favori poko disponib.",
  "settings.title": "Paramèt",
  "settings.subtitle": "Pèsonalize eksperyans ou",
  "settings.language": "Lang",
  "settings.theme": "Tèm",
  "settings.themeLight": "Mòd Klè",
  "settings.fontSize": "Gwosè tèks",
  "settings.notifications": "Notifikasyon",
  "settings.dailyReminders": "Rapèl chak jou",
  "settings.sounds": "Son",
  "settings.accessibility": "Aksesibilite",
  "settings.highContrast": "Kontras Wo",
  "dictionary.title": "Diksyonè",
  "dictionary.subtitle": "Mo ki pi itilize nan lang ou chwazi a",
  "dictionary.search": "Chèche yon mo...",
  "dictionary.empty": "Pa gen mo ki jwenn.",
};

const DICTIONARIES: Record<SupportedLanguage, Dictionary> = { pt, en, es, de, fr, ht };

export function translate(language: SupportedLanguage, key: TranslationKey): string {
  return DICTIONARIES[language]?.[key] ?? DICTIONARIES.pt[key] ?? key;
}
