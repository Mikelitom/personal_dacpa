// __tests__/login.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Login from '@/app/login/page';

// Mock de los módulos
const mockReplace = jest.fn();
const mockRouter = { replace: mockReplace };
const mockSupabaseAuth = { signInWithPassword: jest.fn() };
const mockSupabaseFrom = { select: jest.fn(), eq: jest.fn(), single: jest.fn() };
const mockSupabase = {
  auth: mockSupabaseAuth,
  from: jest.fn().mockReturnValue(mockSupabaseFrom),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);
(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

describe('Componente Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabaseFrom.select.mockReturnValue(mockSupabaseFrom);
    mockSupabaseFrom.eq.mockReturnValue(mockSupabaseFrom);
  });

  test('renderiza correctamente el formulario de login', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('actualiza el estado cuando se ingresan credenciales', () => {
    render(<Login />);
    
    const usuarioInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    fireEvent.change(usuarioInput, { target: { value: 'usuario@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(usuarioInput).toHaveValue('usuario@test.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('redirige a administrador cuando el login es exitoso con rol admin', async () => {
    // Preparar respuestas mock
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'admin@test.com' } },
      error: null,
    });
    
    mockSupabaseFrom.single.mockResolvedValue({
      data: { rol: 'admin', nombre_completo: 'Admin Test', estado: 'activo' },
      error: null,
    });
    
    render(<Login />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verificar que se llamaron los métodos correctos
    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
      
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith('rol, nombre_completo, estado');
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith('correo', 'admin@test.com');
      expect(mockReplace).toHaveBeenCalledWith('/dashboard-admin');
    });
  });

  test('redirige a usuario regular cuando el login es exitoso con rol no admin', async () => {
    // Preparar respuestas mock
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'user@test.com' } },
      error: null,
    });
    
    mockSupabaseFrom.single.mockResolvedValue({
      data: { rol: 'usuario', nombre_completo: 'Usuario Test', estado: 'activo' },
      error: null,
    });
    
    render(<Login />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verificar que se llamaron los métodos correctos
    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'password123',
      });
      
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('muestra error cuando la autenticación falla', async () => {
    // Preparar respuesta de error
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: null,
      error: new Error('Credenciales inválidas'),
    });
    
    render(<Login />);
    
    // Llenar y enviar el formulario
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'usuario@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password_incorrecto' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
    });
  });

  test('no permite login para usuario con estado inactivo', async () => {
    // Preparar respuestas mock
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'inactivo@test.com' } },
      error: null,
    });
    
    mockSupabaseFrom.single.mockResolvedValue({
      data: { rol: 'usuario', nombre_completo: 'Usuario Inactivo', estado: 'inactivo' },
      error: null,
    });
    
    render(<Login />);
    
    // Llenar y enviar el formulario
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'inactivo@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verificar que se muestra el mensaje de error por estado inactivo
    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Tu cuenta está inactiva');
    });
  });
});