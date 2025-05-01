import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Alumno } from "../types";
import { Database } from "@/app/lib/types";
import { useState, useEffect } from "react";

export function useAlumnos(idPadre: number | undefined) {
  const supabase = createClientComponentClient<Database>();

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idPadre === undefined) return;

    const fetchAlumnos = async () => {
      

      try {
        setLoading(true);
        const response = await fetch(`/api/alumnos/${idPadre}/by_id`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "useAlumnos: Error fetching alumnos"
          );
        }

        const data = await response.json();

        setAlumnos(data);
      } catch (error) {
        console.error("useAlumnos: Error al llamar a la API");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
  }, [idPadre]);

  return { alumnos, loading };
}
