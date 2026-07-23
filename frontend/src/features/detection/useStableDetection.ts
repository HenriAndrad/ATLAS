import { useEffect, useRef, useState } from "react";
import type { DetectedObject } from "./useObjectDetection";

// Quantos frames seguidos a mesma classe precisa aparecer antes de
// confiarmos nela o suficiente pra traduzir/falar/salvar no histórico.
const REQUIRED_STABLE_FRAMES = 3;

/// Filtra "piscadas" de detecção: se o modelo identifica algo diferente
/// a cada frame (comum em visão computacional em tempo real, principalmente
/// com pouca luz ou objetos parecidos), isso é ruído — não uma detecção
/// de verdade. Só retorna uma detecção depois que a mesma classe se
/// mantém por `REQUIRED_STABLE_FRAMES` frames seguidos.
export function useStableDetection(candidate: DetectedObject | null): DetectedObject | null {
  const [stable, setStable] = useState<DetectedObject | null>(null);
  const streakRef = useRef<{ class: string; count: number }>({ class: "", count: 0 });

  useEffect(() => {
    if (!candidate) {
      streakRef.current = { class: "", count: 0 };
      setStable(null);
      return;
    }

    if (candidate.class === streakRef.current.class) {
      streakRef.current.count += 1;
    } else {
      // Trocou de classe: exige confirmar de novo antes de mostrar,
      // em vez de continuar mostrando a classe antiga "grudada" na tela.
      streakRef.current = { class: candidate.class, count: 1 };
      setStable(null);
    }

    if (streakRef.current.count >= REQUIRED_STABLE_FRAMES) {
      setStable(candidate);
    }
  }, [candidate]);

  return stable;
}
