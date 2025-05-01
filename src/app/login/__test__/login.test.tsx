// __tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../page";
import { useRouter } from "next/navigation";
import * as authModule from "@/app/lib/auth";

// Mock del router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock del handleLogin
jest.mock("@/app/lib/auth", () => ({
  handleLogin: jest.fn(),
}));

describe("Login", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it("muestra error si los campos están vacíos", async () => {
    render(<Login/>);

    const boton = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(boton);

    expect(await screen.findByText(/debes ingresar tu correo y contraseña/i)).toBeInTheDocument();
  });

  it("llama a handleLogin y redirecciona según el rol", async () => {
    (authModule.handleLogin as jest.Mock).mockResolvedValue({
      success: true,
      rol: "admin",
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: "admin@test.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(authModule.handleLogin).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "123456",
      });
      expect(push).toHaveBeenCalledWith("/admin_dashboard");
    });
  });

  it("muestra error si handleLogin falla", async () => {
    (authModule.handleLogin as jest.Mock).mockResolvedValue({
      success: false,
      error: "Correo o contraseña incorrectos.",
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: "invalido@test.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
  });
});
