import { NextResponse } from 'next/server';
import { userService } from '@/app/services/dbService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const padre = await userService.getPadreFamiliaById(id);
    return NextResponse.json(padre);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}