import { useEffect, useState } from "react";
import { Alumno, Convenio, PadreFamilia, PagoColegiatura } from "../types";
import { useUsuario } from "./use-usuario";

export function useProfilePage() {
  const { usuario, loading: loadingUsuario } = useUsuario();

  const [padre, setPadre] = useState<PadreFamilia | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [pagos, setPagos] = useState<PagoColegiatura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.debug("🔄 Iniciando carga de datos del perfil");

      if (!usuario?.id_padre) {
        console.debug("⚠️ Usuario no tiene id_padre, se aborta fetch");
        return;
      }

      try {
        console.debug(`📡 Fetch padre: /api/padre-familia/${usuario.id_padre}`);
        const resPadre = await fetch(`/api/padre-familia/${usuario.id_padre}`);
        if (!resPadre.ok) {
          const errorData = await resPadre.json();
          throw new Error(errorData.error || "Failed fetching padre");
        }

        const dataPadre = await resPadre.json();
        console.debug("✅ Padre obtenido:", dataPadre);
        setPadre(dataPadre);

        console.debug(`📡 Fetch alumnos: /api/alumnos/${dataPadre.id_padre}/by_id`);
        const resAlumnos = await fetch(`/api/alumnos/${dataPadre.id_padre}/by_id`);
        if (!resAlumnos.ok) {
          const errorData = await resAlumnos.json();
          throw new Error(errorData.error || "Failed fetching alumnos");
        }

        const dataAlumnos = await resAlumnos.json();
        console.debug("Alumnos obtenidos:", dataAlumnos);
        setAlumnos(dataAlumnos);

        console.debug(`📡 Fetch convenios: /api/convenios/${dataPadre.id_padre}/padre`);
        const resConvenios = await fetch(`/api/convenios/${dataPadre.id_padre}/padre`);
        if (!resConvenios.ok) {
          const errorData = await resConvenios.json();
          throw new Error(errorData.error || "Failed fetching convenios");
        }

        const dataConvenios = await resConvenios.json();
        console.debug("✅ Convenios obtenidos:", dataConvenios);
        setConvenios(dataConvenios);

        console.debug("📡 Fetch pagos de todos los alumnos...");
        const pagosAlumnos = await Promise.all(
          dataAlumnos.map(async (alumno: { id_alumno: any; }) => {
            console.debug(`➡️ Fetch pagos del alumno ${alumno.id_alumno}`);
            const res = await fetch(`/api/pago-colegiatura/${alumno.id_alumno}/all`);
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Failed fetching pagos by alumno");
            }
            const pagos = await res.json();
            console.debug(`✅ Pagos obtenidos para alumno ${alumno.id_alumno}:`, pagos);
            return pagos;
          })
        );

        const pagosFlattened = pagosAlumnos.flat();
        console.debug("✅ Todos los pagos combinados:", pagosFlattened);
        setPagos(pagosFlattened);
      } catch (error) {
        console.error("❌ useProfilePage: Error llamando a la API", error);
      } finally {
        setLoading(false);
        console.debug("✅ Finalizó carga de datos del perfil");
      }
    };

    fetchData();
  }, [usuario]);

  return { usuario, padre, alumnos, convenios, pagos, loading };
}
