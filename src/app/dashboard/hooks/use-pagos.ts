import type { PagoColegiatura } from "../types";
import { useEffect, useState } from "react";

export function usePagosColegiatura(listaId: Number[] | undefined) {
  const [data, setData] = useState<PagoColegiatura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listaId === undefined) return;

    const fetchPagos = async () => {
      setLoading(true);

      try {
        const results = await Promise.all(
          listaId.map(async (id) => {
            const response = await fetch(`/api/pago-colegiatura/${id}/all`);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed fetching pagos");
            }

            const pagos = await response.json();
            return pagos;
          })
        );

        const agrupados = results.flat();
        setData(agrupados)
      } catch (error) {
        console.error('usePagos: Error al llamar a la API => ', error)
      } finally {
        setLoading(false)
      }
    };

    fetchPagos();
  }, [listaId]);

  return { data, loading }
}
