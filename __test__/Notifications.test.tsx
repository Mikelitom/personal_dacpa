import { act, render, screen, waitFor } from "@testing-library/react";
import { Notifications } from "@/app/components/dashboard/Notifications"; // Ajusta la ruta según corresponda
import { toast, useToast } from "@/app/components/ui/use-toast";

// Mock del hook useToast
jest.mock("@/app/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock para la función fetch
global.fetch = jest.fn() as jest.Mock; // Aquí hacemos el cast explícito a jest.Mock

describe("Notifications", () => {
  let toastMock: jest.Mock;

  beforeEach(() => {
    toastMock = jest.fn(); // Creamos el mock para la función toast
    (useToast as jest.Mock).mockReturnValue({ toast: toastMock }); // Hacemos cast explícito
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar el componente correctamente", () => {
    render(<Notifications notifications={0} />);

    expect(screen.getByText("Notificaciones")).toBeInTheDocument();
  });

  it("debe mostrar un mensaje de carga mientras se obtienen las notificaciones", () => {
    // Simula un fetch lento (sin resolver)
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    ); // Aquí casteamos fetch

    render(<Notifications notifications={0} />);

    expect(screen.getByText("Notificaciones")).toBeInTheDocument();
    // Ahora que el componente muestra "Cargando..." durante la carga, este test debería pasar
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("debe mostrar un error cuando ocurre un fallo al cargar las notificaciones", async () => {
    // Simulamos el fallo de la API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    // Renders el componente Notifications
    render(<Notifications notifications={0} />);

    // Esperamos que el texto de "Cargando..." aparezca
    await screen.findByText("Cargando...");

    // Usamos `act()` para envolver la actualización de estado
    await act(async () => {
      // Simulamos que la API falla y actualiza el estado
      await screen.findByText(
        "No pudimos cargar las notificaciones. Por favor, intenta más tarde."
      );
    });

    // Asegúrate de que el toast se llama con el mensaje de error correcto
    expect(useToast().toast).toHaveBeenCalledWith({
      title: "Error al cargar notificaciones",
      description:
        "No pudimos cargar las notificaciones. Por favor, intenta más tarde.",
      variant: "destructive",
    });
  });
});

it("debe mostrar las notificaciones correctamente cuando se obtienen datos válidos", async () => {
  const mockData = [
    {
      id: 1,
      title: "Pago",
      message: "Tu pago ha sido procesado",
      time: "Hace 1 hora",
      type: "payment",
    },
    {
      id: 2,
      title: "Advertencia",
      message: "Revisa tus configuraciones",
      time: "Hace 2 horas",
      type: "warning",
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockData),
  });

  render(<Notifications notifications={mockData.length} />);

  // Espera que las notificaciones se muestren
  await waitFor(() => {
    expect(screen.getByText("Pago")).toBeInTheDocument();
    expect(screen.getByText("Revisa tus configuraciones")).toBeInTheDocument();
  });

  // Verifica los tipos de notificaciones (colores)
  expect(screen.getByText("Pago").closest("div")).toHaveClass("bg-pink-50");
  expect(
    screen.getByText("Revisa tus configuraciones").closest("div")
  ).toHaveClass("bg-amber-50");
});
