import { NextResponse } from 'next/server'
import { userService } from '@/app/services/dbService'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const parentId = (await params).id;

    const alumnos = await userService.getAlumnoByParentId(parentId);

    return NextResponse.json(alumnos);
  } catch (error) {
    console.error('Error en el handler GET /api/alumnos/[id]/parent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}