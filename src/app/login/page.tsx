"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [ loading, setLoading ] = useState(false);
  const [ correo, setCorreo ] = useState('');
  const [ contraseña, setContraseña ] = useState('');
  const [ error, setError ] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contraseña
      });
  
      if (authError) throw authError;
  
      const { data: userData, error: userError } = await supabase
        .from('Usuario')
        .select('rol, nombre_completo, estado')
        .eq('correo', correo)
        .single();
        
      if (userError) throw userError;
  
      if (userData.estado !== 'activo') {
        throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
      }
  
      // Redirigir forzando reload completo para que el middleware vea las cookies nuevas
      const dashboardUrl = userData.rol === 'admin' ? '/dashboard-admin' : '/dashboard';
      window.location.href = dashboardUrl;
  
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }
  
  

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Left side with blue background */}
      <div className="hidden md:flex md:w-2/5 flex-col bg-gradient-to-b from-pink-400 to-pink-500 text-white p-10 relative overflow-hidden">
               
        {/* Content */}
        <div className="relative z-10">
          <div className="font-bold text-2xl mb-16">COLEGIO DAC</div>
          <h1 className="text-4xl font-bold mb-4">Bienvenidos</h1>
          
          <p className="mb-8 opacity-90">
            
          </p>
          
          <div className="mt-auto pt-40">
            <p className="opacity-90">Despertar al Conocimiento</p>
          </div>
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="w-full md:w-3/5 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-pink-500 mb-2">Iniciar Sesion</h2> 
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-500 mb-2">Usuario</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="username" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-500 mb-2">Contraseña</label>
              <div className="relative">
                <input 
                  type="password" 
                  id="password" 
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-pink-300 text-white py-3 rounded-md font-medium hover:bg-pink-400 transition duration-300"
            >
              LOGIN
            </button>
            
            <div className="flex justify-between mt-6 text-sm">
              <div>
                <span className="text-gray-500">New User?</span>{" "}
                <a href="#" className="text-blue-500 hover:underline">Signup</a>
              </div>
              <a href="#" className="text-gray-400 hover:underline">Forgot your password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
