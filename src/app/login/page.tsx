"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    document.cookie = "token=valid-token; path=/dashboard";
    router.push("/dashboard");
  };

  const handleLoginAdmin = async () => {
    setLoading(true);
    document.cookie = "token=valid-token; path=/admin-dashboard";
    router.push("/admin-dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white m-4 px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>

      <button
        onClick={handleLoginAdmin}
        className="bg-blue-500 text-white m-4 px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión Admin"}
      </button>
    </div>
  );
}
