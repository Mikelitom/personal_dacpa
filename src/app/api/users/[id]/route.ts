// app/api/[tabla]/[id]/route.ts - Endpoint para obtener un registro específico por ID
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(
  { params }: { params: { tabla: string; id: string } }
) {
  try {
    const { tabla, id } = params;
    
    const { data, error } = await supabase
      .from(tabla)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}