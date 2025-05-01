import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const correo = (await params).email;

    const usuario = await userService.getUsuarioByEmail(correo);

    if (!usuario) {
      return NextResponse.json({ error: 'Padre no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error en el handler GET /api/usuario/[email]/usuario:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
