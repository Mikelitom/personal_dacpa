import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const alumnoId = (await params).id; // ✅ aquí ya está bien
    const convenio = await userService.getConvenioByIdAlumno(alumnoId);
    return NextResponse.json(convenio);
  } catch (error) {
    console.error('Error en el handler GET /api/convenios/[id]/by_id:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
