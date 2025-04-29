// CarritoPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import CarritoPage from "@/app/dashboard/carrito/page"; // Ajusta la ruta según la ubicación real
import userEvent from "@testing-library/user-event";

// Mocks globales para los componentes
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock para todos los componentes de la UI
jest.mock("@/app/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-footer">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

jest.mock("@/app/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, variant, size }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/app/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock("@/app/components/ui/label", () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

jest.mock("@/app/components/ui/select", () => {
  const React = require("react");
  return {
    Select: ({ children, value, onValueChange }: any) => {
      const [selected, setSelected] = React.useState(value || "");

      const handleChange = (newValue: string) => {
        setSelected(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      };

      return (
        <div data-testid="select">
          {React.Children.map(children, (child: any) =>
            React.cloneElement(child, { onSelect: handleChange, selected })
          )}
        </div>
      );
    },
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-content">{children}</div>
    ),
    SelectItem: ({ children, value, onSelect }: any) => (
      <div
        data-testid="select-item"
        data-value={value}
        onClick={() => onSelect(value)}
        style={{
          cursor: "pointer",
          backgroundColor: "lightgray",
          margin: "2px",
        }}
      >
        {children}
      </div>
    ),
    SelectTrigger: ({ children, id }: any) => (
      <div data-testid="select-trigger" id={id} role="combobox">
        {children}
      </div>
    ),
    SelectValue: ({ placeholder }: { placeholder: string }) => (
      <div data-testid="select-value">
        {placeholder || "Valor Seleccionado"}
      </div>
    ),
  };
});

jest.mock("@/app/components/ui/tabs", () => ({
  Tabs: ({ children, defaultValue, onValueChange }: any) => (
    <div
      data-testid="tabs"
      data-defaultvalue={defaultValue}
      onChange={(e: any) => onValueChange && onValueChange(e.target.value)}
    >
      {children}
    </div>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid="tabs-content" data-value={value}>
      {children}
    </div>
  ),
  TabsList: ({ children, className }: any) => (
    <div data-testid="tabs-list" className={className}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value }: any) => (
    <div data-testid="tabs-trigger" data-value={value} role="tab">
      {children}
    </div>
  ),
}));

jest.mock("@/app/components/ui/separator", () => ({
  Separator: ({ className }: { className?: string }) => (
    <hr className={className} />
  ),
}));

jest.mock("lucide-react", () => ({
  ShoppingCart: () => <span data-icon="shopping-cart">ShoppingCart</span>,
  CreditCard: () => <span data-icon="credit-card">CreditCard</span>,
  Trash2: () => <span data-icon="trash">Trash2</span>,
  CheckCircle2: () => <span data-icon="check-circle">CheckCircle2</span>,
  ArrowLeft: () => <span data-icon="arrow-left">ArrowLeft</span>,
}));

// Mock para useToast - Creamos un mock más accesible para los tests
const mockToast = jest.fn();
jest.mock("@/app/components/ui/toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock("@/app/components/ui/toaster", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

// Test suite principal
describe("CarritoPage Component", () => {
  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verificar que el componente renderiza correctamente
  test("renderiza el componente CarritoPage con productos en el carrito", async () => {
    render(<CarritoPage />);

    // Esperamos a que cargue el componente (simulación de carga)
    await waitFor(() => {
      expect(screen.queryByText(/carrito de compras/i)).toBeInTheDocument();
    });

    // Verificamos que se muestren los productos
    expect(
      screen.queryByText("Paquete de Libros - 1er Grado")
    ).toBeInTheDocument();
    expect(screen.queryByText("Uniforme Deportivo")).toBeInTheDocument();
    expect(screen.queryByText("Uniforme de Diario (Niña)")).toBeInTheDocument();
  });

  // Test 2: Verificar que se puede eliminar un producto del carrito
  test("permite eliminar un producto del carrito", async () => {
    render(<CarritoPage />);

    await waitFor(() => {
      expect(
        screen.queryByText("Paquete de Libros - 1er Grado")
      ).toBeInTheDocument();
    });

    // Obtenemos todos los botones que tengan un ícono de basura y hacemos clic en el primero
    const deleteButtons = screen.getAllByText("Trash2");
    fireEvent.click(deleteButtons[0]);

    // Verificamos que el producto ya no está en el carrito
    expect(
      screen.queryByText("Paquete de Libros - 1er Grado")
    ).not.toBeInTheDocument();
  });

  // Test 3: Verificar que se puede cambiar la cantidad de un producto
  test("permite aumentar la cantidad de un producto", async () => {
    render(<CarritoPage />);

    await waitFor(() => {
      expect(
        screen.queryByText("Paquete de Libros - 1er Grado")
      ).toBeInTheDocument();
    });

    // Buscamos los botones de incremento/decremento
    const incrementButtons = screen.getAllByText("+");

    // Guardamos una referencia al elemento de cantidad antes de incrementar
    const cantidadAntesDom = screen.getAllByText("1")[0]; // Suponiendo que empieza en 1

    // Incrementamos la cantidad
    fireEvent.click(incrementButtons[0]);

    // Verificamos que la cantidad haya aumentado
    expect(cantidadAntesDom).toHaveTextContent("2");
  });

  // Test 4: Verificar que se puede vaciar el carrito
  test("permite vaciar el carrito completo", async () => {
    render(<CarritoPage />);

    await waitFor(() => {
      expect(screen.queryByText(/carrito de compras/i)).toBeInTheDocument();
    });

    // Hacemos clic en el botón de vaciar carrito
    const vaciarButton = screen.getByText("Vaciar carrito");
    fireEvent.click(vaciarButton);

    // Verificamos que aparezca el mensaje de carrito vacío
    expect(screen.queryByText("Tu carrito está vacío")).toBeInTheDocument();
  });

  // Test 5: Verificar que muestra un error al intentar pagar sin seleccionar estudiante
  // test("muestra error al intentar pagar sin seleccionar estudiante", async () => {
  //   render(<CarritoPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText(/carrito de compras/i)).toBeInTheDocument();
  //   });

  //   // Intentamos pagar sin seleccionar estudiante
  //   const pagarButton = screen.getByText(/pagar \$/i);
  //   fireEvent.click(pagarButton);

  //   // Esperamos a que se llame a toast
  //   await waitFor(() => {
  //     // Verificamos que se llamó a la función toast con el mensaje de error
  //     expect(mockToast).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         title: "Selecciona un estudiante",
  //         variant: "destructive",
  //       })
  //     );
  //   });
  // });

  // // Test 6: Verificar proceso de pago exitoso
  // // Test 6: Verificar proceso de pago exitoso
  // test("muestra pantalla de éxito después de un pago exitoso", async () => {
  //   // Mockeamos setTimeout para que se ejecute inmediatamente
  //   jest.useFakeTimers();

  //   render(<CarritoPage />);

  //   // Esperamos a que el componente termine de cargar
  //   await waitFor(() => {
  //     expect(screen.getByText("Carrito de Compras")).toBeInTheDocument();
  //   });

  //   // Simulamos la interacción con el select
  //   const estudianteSelect = screen.getByTestId("select-trigger");

  //   // Abrimos el select
  //   fireEvent.click(estudianteSelect);

  //   // Ahora simulamos la selección del estudiante (est1)
  //   const selectItem = screen.getByText("Ana Pérez González - 1°A"); // Asegúrate de que este texto coincide exactamente
  //   fireEvent.click(selectItem);

  //   // Verificamos que el valor seleccionado se ha actualizado
  //   const selectValue = screen.getByTestId("select-value");
  //   expect(selectValue).toHaveTextContent("Ana Pérez González - 1°A"); // Verifica que el valor seleccionado se muestra correctamente

  //   // Hacemos clic en el botón de pagar
  //   const pagarButton = screen.getByText(/pagar \$/i);
  //   fireEvent.click(pagarButton);

  //   // Avanzamos el tiempo para que termine la simulación de pago
  //   jest.advanceTimersByTime(2000);

  //   // Verificamos que se muestre el mensaje de éxito
  //   await waitFor(
  //     () => {
  //       const successElement = screen.getByText(/compra realizada con éxito/i);
  //       expect(successElement).toBeInTheDocument();
  //     },
  //     { timeout: 3000 }
  //   );

  //   // Restauramos setTimeout
  //   jest.useRealTimers();
  // });

  // Test 7: Verificar que se puede cambiar entre métodos de pago
  test("permite cambiar entre métodos de pago", async () => {
    render(<CarritoPage />);

    await waitFor(() => {
      expect(screen.getByText("Carrito de Compras")).toBeInTheDocument();
    });

    // Por defecto debería estar en "Tarjeta de Crédito"
    expect(screen.getByLabelText("Número de Tarjeta")).toBeInTheDocument();

    // Cambiamos a "Transferencia"
    const transferenciaTab = screen.getByRole("tab", { name: "Transferencia" });
    fireEvent.click(transferenciaTab);

    // Verificamos que muestre la información de transferencia
    expect(screen.getByText("Datos para Transferencia:")).toBeInTheDocument();
    expect(screen.getByLabelText("Subir Comprobante")).toBeInTheDocument();
  });
});
