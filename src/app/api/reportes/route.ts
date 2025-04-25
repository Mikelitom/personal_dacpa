import { NextResponse } from 'next/server';
import { userService } from '@/app/services/dbService';

export async function GET() {
  try {
    const reportes = await userService.getReportes();
    return NextResponse.json(reportes);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}