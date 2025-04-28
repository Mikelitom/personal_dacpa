import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoria: string }> }
) {
  try {
    const categoria = (await params).categoria; // ✅ aquí ya está bien
    const convenio = await userService.getArticulosByCategoria(categoria);
    return NextResponse.json(convenio);
  } catch (error) {
    console.error('Error en el handler GET /api/articulos/[categoria]/:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
