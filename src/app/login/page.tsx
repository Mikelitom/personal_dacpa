"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    document.cookie = "token=valid-token; path=/";
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </div>
  );
}
