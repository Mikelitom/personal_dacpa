// lib/__tests__/auth.test.ts
import { handleLogin, handleLogOut } from "../auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// 👇 Mock explícito del cliente Supabase
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}));

const mockSignInWithPassword = jest.fn();
const mockSelect = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockSingle = jest.fn();
const mockSignOut = jest.fn();


beforeEach(() => {
  jest.clearAllMocks();

  // Configura lo que devuelve Supabase
  (createClientComponentClient as jest.Mock).mockReturnValue({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut
    },
    from: () => ({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    }),
  });
});

describe("handleLogin", () => {
  it("debe fallar si faltan email o password", async () => {
    const res = await handleLogin({ email: "", password: "" });
    expect(res.success).toBe(false);
    expect(res.error).toBe("Correo y contraseña son requeridos");
  });

  it("debe devolver error si las credenciales son inválidas", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid login credentials" },
    });

    const res = await handleLogin({ email: "test@example.com", password: "1234" });
    expect(res.success).toBe(false);
    expect(res.error).toBe("Correo o contraseña incorrectos.");
  });

  it("debe devolver error si falla al obtener el rol", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: "dummySession" },
      error: null,
    });

    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found" },
    });

    const res = await handleLogin({ email: "test@example.com", password: "1234" });
    expect(res.success).toBe(false);
    expect(res.error).toBe("No se pudo obtener el tipo de usuario.");
  });

  it("debe logear correctamente y devolver el rol", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: "dummySession" },
      error: null,
    });

    mockSingle.mockResolvedValueOnce({
      data: { rol: "padre" },
      error: null,
    });

    const res = await handleLogin({ email: "padre@mail.com", password: "1234" });
    expect(res.success).toBe(true);
    expect(res.session).toBe("dummySession");
    expect(res.rol).toBe("padre");
  });
});

describe("handleLogout", () => {
  it("debe cerrar sesión correctamente", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const result = await handleLogOut();

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("debe manejar errores al cerrar sesión", async () => {
    mockSignOut.mockResolvedValue({ error: { message: "Logout error" } });

    const result = await handleLogOut();

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error al cerrar sesión.");
  });
});