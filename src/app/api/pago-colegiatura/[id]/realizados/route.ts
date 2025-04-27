import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const alumnoId = (await params).id;
    const pagoColegiatura = await userService.getAllPagadosByAlumno(alumnoId);
    return NextResponse.json(pagoColegiatura);
  } catch (error) {
    console.error('Error en el handler GET /api/pago-colegiatura/[id]/realizados:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}