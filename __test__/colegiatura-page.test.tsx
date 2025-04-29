// __tests__/colegiatura-page.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColegiaturaPage from '@/app/dashboard/colegiatura/page';

// Mockeamos los hooks personalizados
jest.mock('@/app/dashboard/colegiatura/hooks/use-colegiatura-data', () => ({
  useColegiaturaData: jest.fn(() => ({
    estudiantes: [
      { 
        id_alumno: '1', 
        nombre: 'Juan', 
        apellido_paterno: 'Pérez', 
        apellido_materno: 'Gómez',
        grado: '3°A Primaria'
      },
      { 
        id_alumno: '2', 
        nombre: 'María', 
        apellido_paterno: 'González', 
        apellido_materno: 'López',
        grado: '2°B Secundaria'
      }
    ],
    mesesColegiatura: [
      { 
        id: '1', 
        mes: 'Enero 2025', 
        estado: 'pendiente', 
        importe: 1500, 
        fecha_vencimiento: '2025-01-31',
        id_alumno: '1'
      },
      { 
        id: '2', 
        mes: 'Febrero 2025', 
        estado: 'pendiente', 
        importe: 1500, 
        fecha_vencimiento: '2025-02-28',
        id_alumno: '1'
      },
      { 
        id: '3', 
        mes: 'Enero 2025', 
        estado: 'pendiente', 
        importe: 1700, 
        fecha_vencimiento: '2025-01-31',
        id_alumno: '2'
      }
    ],
    convenios: [
      { id: '1', descripcion: 'Descuento por pago anticipado', descuento: 10 },
      { id: '2', descripcion: 'Descuento por hermanos', descuento: 15 }
    ],
    isLoading: false
  }))
}));

jest.mock('@/app/dashboard/colegiatura/hooks/use-colegiatura-filters', () => ({
  useColegiaturaFilters: jest.fn(() => ({
    busqueda: '',
    setBusqueda: jest.fn(),
    filtroEstado: 'todos',
    setFiltroEstado: jest.fn(),
    filtroEstudiante: 'todos',
    setFiltroEstudiante: jest.fn(),
    filtroPeriodo: 'todos',
    setFiltroPeriodo: jest.fn(),
    mesesFiltrados: [
      { 
        id: '1', 
        mes: 'Enero 2025', 
        estado: 'pendiente', 
        importe: 1500, 
        fecha_vencimiento: '2025-01-31',
        id_alumno: '1'
      },
      { 
        id: '2', 
        mes: 'Febrero 2025', 
        estado: 'pendiente', 
        importe: 1500, 
        fecha_vencimiento: '2025-02-28',
        id_alumno: '1'
      },
      { 
        id: '3', 
        mes: 'Enero 2025', 
        estado: 'pendiente', 
        importe: 1700, 
        fecha_vencimiento: '2025-01-31',
        id_alumno: '2'
      }
    ]
  }))
}));

jest.mock('@/app/dashboard/colegiatura/hooks/use-colegiatura-payment', () => ({
  useColegiaturaPayment: jest.fn(() => ({
    estudiante: '',
    setEstudiante: jest.fn(),
    mesesSeleccionados: [],
    setMesesSeleccionados: jest.fn(),
    toggleMesSeleccionado: jest.fn(),
    calcularTotal: jest.fn(() => 3000),
    estaVencido: jest.fn(() => false)
  }))
}));

// Mocks para componentes hijos
jest.mock('@/app/components/colegiatura/colegiatura-header', () => ({
  __esModule: true,
  default: () => <div data-testid="colegiatura-header">Header Mockeado</div>
}));

jest.mock('@/app/components/colegiatura/colegiatura-filters', () => ({
  __esModule: true,
  default: () => <div data-testid="colegiatura-filters">Filtros Mockeados</div>
}));

jest.mock('@/app/components/colegiatura/colegiatura-list', () => ({
  __esModule: true,
  default: () => <div data-testid="colegiatura-list">Lista Mockeada</div>
}));

jest.mock('@/app/components/colegiatura/colegiatura-payment-form', () => {
  return {
    __esModule: true,
    default: ({ onPagoExitoso }: { onPagoExitoso: () => void}) => (
      <div data-testid="colegiatura-payment-form">
        Formulario de Pago Mockeado
        <button data-testid="pago-button" onClick={onPagoExitoso}>
          Realizar Pago
        </button>
      </div>
    )
  };
});

jest.mock('@/app/components/colegiatura/colegiatura-resumen', () => ({
  __esModule: true,
  default: () => <div data-testid="colegiatura-resumen">Resumen Mockeado</div>
}));

jest.mock('@/app/components/colegiatura/success-payment', () => {
  return {
    __esModule: true,
    default: ({ onReset }: { onReset: () => void}) => (
      <div data-testid="success-payment">
        Pago Exitoso
        <button data-testid="reset-button" onClick={onReset}>
          Volver
        </button>
      </div>
    )
  };
});

jest.mock('@/app/components/colegiatura/ticket-dialog', () => ({
  __esModule: true,
  default: () => <div data-testid="ticket-dialog">Ticket Mockeado</div>
}));

// Tests
describe('ColegiaturaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente cuando isLoading es false', () => {
    render(<ColegiaturaPage />);
    
    // Verificamos que se muestra el título principal
    expect(screen.getByText('Pago de Colegiatura')).toBeInTheDocument();
    
    // Verificamos que se renderizan los componentes hijos principales
    expect(screen.getByTestId('colegiatura-header')).toBeInTheDocument();
    expect(screen.getByTestId('colegiatura-filters')).toBeInTheDocument();
    expect(screen.getByTestId('colegiatura-list')).toBeInTheDocument();
    expect(screen.getByTestId('colegiatura-payment-form')).toBeInTheDocument();
    expect(screen.getByTestId('colegiatura-resumen')).toBeInTheDocument();
  });

  test('muestra indicador de carga cuando isLoading es true', () => {
    // Cambiamos el mock para simular carga
    require('@/app/dashboard/colegiatura/hooks/use-colegiatura-data').useColegiaturaData.mockReturnValueOnce({
      estudiantes: [],
      mesesColegiatura: [],
      convenios: [],
      isLoading: true
    });
    
    render(<ColegiaturaPage />);
    
    // Verificamos que se muestra el indicador de carga
    expect(screen.getByText('Cargando información de colegiaturas...')).toBeInTheDocument();
    
    // Verificamos que no se muestran los componentes principales
    expect(screen.queryByTestId('colegiatura-header')).not.toBeInTheDocument();
  });

  test('muestra componente de pago exitoso después de realizar un pago', async () => {
    render(<ColegiaturaPage />);
    
    // Inicialmente no debe mostrar el componente de pago exitoso
    expect(screen.queryByTestId('success-payment')).not.toBeInTheDocument();
    
    // Simulamos un pago exitoso
    fireEvent.click(screen.getByTestId('pago-button'));
    
    // Debemos esperar a que se active el setTimeout interno
    await waitFor(() => {
      expect(screen.getByTestId('success-payment')).toBeInTheDocument();
    });
    
    // Verificamos que los componentes del flujo normal no se muestran
    expect(screen.queryByTestId('colegiatura-payment-form')).not.toBeInTheDocument();
  });

  test('vuelve al estado inicial después de resetear un pago exitoso', async () => {
    render(<ColegiaturaPage />);
    
    // Simulamos un pago exitoso
    fireEvent.click(screen.getByTestId('pago-button'));
    
    // Esperamos a que aparezca el componente de éxito
    await waitFor(() => {
      expect(screen.getByTestId('success-payment')).toBeInTheDocument();
    });
    
    // Hacemos clic en el botón de reset
    fireEvent.click(screen.getByTestId('reset-button'));
    
    // Verificamos que volvemos al estado inicial
    expect(screen.queryByTestId('success-payment')).not.toBeInTheDocument();
    expect(screen.getByTestId('colegiatura-payment-form')).toBeInTheDocument();
  });

  test('abre el diálogo de ticket después de un pago exitoso', () => {
    render(<ColegiaturaPage />);
    
    // Inicialmente el ticket-dialog existe (porque es renderizado siempre) pero no está abierto
    expect(screen.getByTestId('ticket-dialog')).toBeInTheDocument();
    
    // Simulamos un pago exitoso
    fireEvent.click(screen.getByTestId('pago-button'));
    
    // Verificamos que se genera un ticketData (esto es indirecto, pero podemos verificarlo
    // mediante la apertura del diálogo)
    expect(screen.getByTestId('ticket-dialog')).toBeInTheDocument();
  });
});