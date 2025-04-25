import { NextResponse } from 'next/server';
import { userService } from '@/app/services/dbService';

export async function GET() {
  try {
    const usuario = await userService.getPadresFamilia();
    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}