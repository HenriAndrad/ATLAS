import type { SupportedLanguage } from "../../core/constants/appConstants";

// Mapeia os códigos de idioma do app para os códigos BCP 47 que a
// Web Speech API espera, garantindo a pronúncia no idioma certo.
const LANGUAGE_TO_BCP47: Record<SupportedLanguage, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
  ht: "ht-HT",
};

/// Lê `text` em voz alta usando a síntese de voz nativa do navegador.
/// Cancela qualquer fala em andamento antes de começar a nova, para
/// não acumular falas sobrepostas em cliques repetidos.
export function speakText(text: string, language: SupportedLanguage): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_TO_BCP47[language];
  window.speechSynthesis.speak(utterance);
}
