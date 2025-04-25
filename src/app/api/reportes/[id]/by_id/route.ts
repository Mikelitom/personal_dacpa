import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const reportes = await userService.getReporteByIdUsuario(userId);
    return NextResponse.json(reportes);
  } catch (error) {
    console.error('Error en el handler GET /api/reportes/[id]/by_id:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}