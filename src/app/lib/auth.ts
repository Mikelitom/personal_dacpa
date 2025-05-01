import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./types";

interface HandleLoginProps {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
  session?: any;
  rol?: "admin" | "padre" | string;
}

export async function handleLogin({
  email,
  password,
}: HandleLoginProps): Promise<LoginResponse> {
  const supabase = createClientComponentClient<Database>();

  // Validacion de que se recibieron ambos datos
  if (!email || !password) {
    return {
      success: false,
      error: 'Correo y contraseña son requeridos'
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  // Si devuelve error devuelve su debido mensaje (return funcion mapSupabaseError())
  if (error) {
    const errorMessage = mapSupabaseError(error.message);
    return {
      success: false,
      error: errorMessage
    }
  }

  // Consulta a la tabla de usuarios para obtener la informacion del usuario
  const { data: perfil, error: perfilError } = await supabase
    .from("Usuario")
    .select("rol")
    .eq("correo", email)
    .single();

  // En caso de error en la consulta o que no se encuentre el rol devuelve error
  if (perfilError || !perfil?.rol) {
    return {
      success: false,
      error: "No se pudo obtener el tipo de usuario."
    }
  }

  // En caso de que todo vaya bien
  return {
    success: true,
    session: data.session,
    rol: perfil.rol
  }
}

// Funcion para cerrar sesion
export async function handleLogOut(): Promise<{ success: boolean; error?: string }> {
  const supabase = createClientComponentClient<Database>();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: "Error al cerrar sesión."
    };
  }

  return { success: true }
}

// Funcion que valida cual fue el error al enviar los datos dependiendo del mensaje
function mapSupabaseError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión.";
  }
  return "Ocurrió un error al iniciar sesión.";
}