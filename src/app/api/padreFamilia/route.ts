import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function GET( request: Request ) {
  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get('id_usuario');

  if (!userId) {
    return NextResponse.json({ error: 'Se requiere el ID del usuario.'}, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer
      .from('PadreFamilia')
      .select('*')
      .eq('id_usuario', userId);

      if (error) throw error;

      return NextResponse.json({ data });
  } catch (error) {
    console.error('Error al obtener informacion del padre:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}