import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/services/dbService";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.id_usuario) {
    return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
  }

  try {
    const updated = await userService.updateUsuario(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error actualizando al usuario." }, { status: 500 })
  }
}