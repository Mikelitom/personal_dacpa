import type { Convenio } from "../types";
import { useState, useEffect } from "react";

export function useConvenios(idPadre: number | undefined) {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idPadre === undefined) return;

    const fetchConvenios = async () => {
      try {
        const response = await fetch(`/api/convenios/${idPadre}/padre`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "useConvenios: Failed fetching convenios."
          );
        }

        const data = await response.json();

        setConvenios(data);
      } catch (error) {
        console.error("useConvenios: Error al llamar a la API");
      } finally {
        setLoading(false);
      }
    };

    fetchConvenios();
  }, [idPadre]);

  return { convenios, loading };
}
