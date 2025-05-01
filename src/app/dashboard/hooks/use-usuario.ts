import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Usuario } from "../types";
import { Database } from "@/app/lib/types";
import { useEffect, useState } from "react";

export function useUsuario() {
  const supabase = createClientComponentClient<Database>();
  const [ authUser, setAuthUser ] = useState<any>(null);
  const [ loading, setLoading ] = useState(true);
  const [ usuario, setUsuario ] = useState<Usuario | null>()

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error("Error obteniendo user.auth: ", userError?.message);
        setAuthUser(null);
        setLoading(false);
        return;
      }

      const user = userData.user;

      try {
        const response = await fetch(`/api/usuario/${user.email}`)

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'useUsuario: Error fetching usuario.')
        }

        const data = await response.json();

        setUsuario(data)
      } catch (error) {
        console.error("useUsuario: Error al llamar a la API.")
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };
    
    getSession()
  }, [supabase])
  
  return { usuario, loading };
}