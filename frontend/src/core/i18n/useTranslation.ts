import { useLanguageContext } from "../context/LanguageContext";
import { translate, type TranslationKey } from "./translations";

/// Retorna uma função `t(chave)` que traduz textos da interface para
/// o idioma escolhido pelo usuário na aba Idiomas — o mesmo idioma
/// usado para traduzir os objetos detectados.
export function useTranslation() {
  const { targetLanguage } = useLanguageContext();
  return (key: TranslationKey) => translate(targetLanguage, key);
}
