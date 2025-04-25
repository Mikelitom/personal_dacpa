import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const correo = await params.email;

    const parent = await userService.getPadreFamiliaFromUsuario(correo);

    if (!parent) {
      return NextResponse.json({ error: 'Padre no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(parent);
  } catch (error) {
    console.error('Error en el handler GET /api/usuario/[email]/parent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
