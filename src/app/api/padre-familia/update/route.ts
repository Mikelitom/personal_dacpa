import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/services/dbService";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.id_padre) {
    return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
  }

  try {
    const updated = await userService.updatePadre(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error actualizando al padre" }, { status: 500 })
  }
}