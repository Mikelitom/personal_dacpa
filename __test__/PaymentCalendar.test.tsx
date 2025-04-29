import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentCalendar } from "@/app/components/dashboard/PaymentCalendar";
import { Database } from "@/app/lib/types"; // Asegúrate de que el path sea correcto

type PagoColegiatura = Database["public"]["Tables"]["PagoColegiatura"]["Row"];

describe("PaymentCalendar", () => {
  const payments: PagoColegiatura[] = [
    {
      id_colegiatura: 1,
      id_alumno: 101,
      concepto: "pago",
      monto: 1200,
      fecha_pago: "2025-04-10",
      metodo_pago: "efectivo",
      estado: "completado",
    },
    {
      id_colegiatura: 2,
      id_alumno: 101,
      concepto: "evento",
      monto: 600,
      fecha_pago: "2025-04-20",
      metodo_pago: "tarjeta",
      estado: "pendiente",
    },
  ];

  it("renderiza el título y el mes actual", () => {
    render(<PaymentCalendar payments={payments} />);
    expect(screen.getByText("Calendario de Pagos")).toBeInTheDocument();
    const now = new Date();
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    expect(
      screen.getByText(`${monthNames[now.getMonth()]} ${now.getFullYear()}`)
    ).toBeInTheDocument();
  });

  it("resalta las fechas con pagos o eventos", async () => {
    render(<PaymentCalendar payments={payments} />);
    await waitFor(() => {
      expect(screen.getAllByText("10")[0]).toHaveClass("bg-red-500"); // pago
      expect(screen.getAllByText("20")[0]).toHaveClass("bg-red-500"); // evento
    });
  });

  it("permite navegar entre meses", async () => {
    render(<PaymentCalendar payments={payments} />);
    const [prevBtn, nextBtn] = screen.getAllByRole("button");
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + 1);
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      expect(
        screen.getByText(
          `${monthNames[newDate.getMonth()]} ${newDate.getFullYear()}`
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(prevBtn);
    fireEvent.click(prevBtn);
    await waitFor(() => {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() - 1);
      expect(
        screen.getByText(new RegExp(`${newDate.getFullYear()}`))
      ).toBeInTheDocument();
    });
  });

  it("muestra la lista de fechas importantes", () => {
    render(<PaymentCalendar payments={payments} />);

    const importantDates = screen.getAllByTestId("important-date");

    expect(importantDates[0]).toHaveTextContent("10/4/2025");
    expect(importantDates[0]).toHaveTextContent("efectivo");
    expect(importantDates[0]).toHaveTextContent("completado");
  });
});
