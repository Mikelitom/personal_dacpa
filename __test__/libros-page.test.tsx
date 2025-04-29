import { render, screen, within } from '@testing-library/react';
import PaquetesPage from '@/app/dashboard/productos/books/page';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock del fetch para simular los datos
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Datos de prueba
const mockPaquetes = [
  {
    id_articulo: 1,
    nombre: "Paquete Primaria 1er Grado",
    descripcion: "Paquete completo para primer grado",
    precio_venta: 1200.00,
    stock_actual: 10,
  },
  {
    id_articulo: 2,
    nombre: "Paquete Primaria 2do Grado",
    descripcion: "Paquete completo para segundo grado",
    precio_venta: 1300.00,
    stock_actual: 2,
  },
  {
    id_articulo: 3,
    nombre: "Paquete Primaria 3er Grado",
    descripcion: "Paquete completo para tercer grado",
    precio_venta: 1400.00,
    stock_actual: 0,
  }
];

// Mock global de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockPaquetes),
  })
) as jest.Mock;

describe('PaquetesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el estado de stock correcto para cada paquete', async () => {
    render(<PaquetesPage />);

    // Espera que el título de la página aparezca
    await screen.findByText('Paquetes Escolares');

    // Encuentra el tab seleccionado (1er grado)
    const selectedTab = screen.getByRole('tab', { selected: true });
    expect(selectedTab).toHaveTextContent(/Paquete Primaria 1er Grado/i);

    // Encuentra el contenido correspondiente
    const activePanel = screen.getByRole('tabpanel');
    const enExistenciaBadge = within(activePanel).getByText('En existencia');
    expect(enExistenciaBadge).toBeInTheDocument();

    // 🔵 Cambiar al segundo tab (2do grado)
    const segundoGradoTab = screen.getByRole('tab', { name: /Paquete Primaria 2do Grado/i });
    await userEvent.click(segundoGradoTab);

    // Verifica que ahora el segundo tab está seleccionado
    expect(segundoGradoTab).toHaveAttribute('aria-selected', 'true');

    // Espera que el badge "Pocas existencias" aparezca
    const pocasExistenciasBadge = await screen.findByText('Pocas existencias');
    expect(pocasExistenciasBadge).toBeInTheDocument();

    // 🔵 Cambiar al tercer tab (3er grado)
    const tercerGradoTab = screen.getByRole('tab', { name: /Paquete Primaria 3er Grado/i });
    await userEvent.click(tercerGradoTab);

    expect(tercerGradoTab).toHaveAttribute('aria-selected', 'true');

    const sinExistenciasBadge = await screen.findByText('Sin existencias');
    expect(sinExistenciasBadge).toBeInTheDocument();
  });
});
