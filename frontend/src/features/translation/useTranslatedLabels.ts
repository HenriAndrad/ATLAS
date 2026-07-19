import { useEffect, useRef, useState } from "react";
import type { SupportedLanguage } from "../../core/constants/appConstants";
import { translateText } from "./translationApi";

// Cache em memória, compartilhado entre renders (e entre objetos detectados
// repetidamente): evita chamar o backend de novo para o mesmo par
// rótulo/idioma. Reseta apenas quando a página recarrega.
const translationCache = new Map<string, string>();

const UNAVAILABLE_LABEL = "⚠ tradução indisponível";

/// Recebe os rótulos (em inglês) atualmente detectados na tela e retorna
/// um mapa { rótulo original -> tradução }, buscando no backend apenas
/// os rótulos ainda não traduzidos para o idioma de destino.
export function useTranslatedLabels(
  labels: string[],
  targetLang: SupportedLanguage,
): Record<string, string> {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const pendingRef = useRef<Set<string>>(new Set());

  // Chave estável baseada no conteúdo (não na referência do array), para o
  // efeito não rodar de novo a cada frame só porque `detections` é um
  // array novo com os mesmos rótulos.
  const labelsKey = Array.from(new Set(labels)).sort().join("|");

  useEffect(() => {
    const uniqueLabels = labelsKey ? labelsKey.split("|") : [];

    uniqueLabels.forEach((label) => {
      const cacheKey = `${label}:${targetLang}`;

      const cached = translationCache.get(cacheKey);
      if (cached) {
        setTranslations((prev) => (prev[label] === cached ? prev : { ...prev, [label]: cached }));
        return;
      }

      if (pendingRef.current.has(cacheKey)) return;
      pendingRef.current.add(cacheKey);

      translateText(label, targetLang)
        .then((translated) => {
          translationCache.set(cacheKey, translated);
          setTranslations((prev) => ({ ...prev, [label]: translated }));
        })
        .catch(() => {
          // Falha na tradução (ex: idioma não suportado pelo provedor para
          // texto em tempo real): mostramos isso explicitamente em vez de
          // deixar o aluno achando que "não traduziu" sem motivo aparente.
          // Também guardamos em cache pra não tentar de novo a cada frame.
          translationCache.set(cacheKey, UNAVAILABLE_LABEL);
          setTranslations((prev) => ({ ...prev, [label]: UNAVAILABLE_LABEL }));
        })
        .finally(() => {
          pendingRef.current.delete(cacheKey);
        });
    });
  }, [labelsKey, targetLang]);

  return translations;
}
