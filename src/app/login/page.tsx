"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleLogin } from "../lib/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones de campos vacíos
    if (!correo || !password) {
      setError("Debes ingresar tu correo y contraseña.");
      return;
    }

    setLoading(true);
    const result = await handleLogin({ email: correo, password });
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Error desconocido.');
      return;
    }

    switch (result.rol) {
      case "admin":
        router.push("/admin_dashboard");
        break;
      case "padre":
        router.push('/dashboard');
        break;
      default:
        router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Control Escolar</h1>
          <p className="text-gray-600 mt-2">Accede a tu cuenta para continuar</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6">
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-gray-900"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="flex items-center justify-end">
                <Link href="#" className="text-sm text-pink-600 hover:text-pink-800">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 cursor-pointer text-white"
                  disabled={loading}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">© 2024 Colegio Despertar al Conocimiento</p>
        </div>
      </div>
    </div>
  );
}
