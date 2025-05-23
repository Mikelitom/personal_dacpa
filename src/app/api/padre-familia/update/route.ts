import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/services/dbService";

// Permite tanto POST como PATCH para compatibilidad
export async function POST(req: NextRequest) {
  return handleUpdate(req);
}

// Implementación de PATCH según convenciones REST
export async function PATCH(req: NextRequest) {
  return handleUpdate(req);
}

// Función común para manejar la actualización
async function handleUpdate(req: NextRequest) {
  const body = await req.json();

  if (!body?.id_padre) {
    return NextResponse.json({ error: 'Se requiere id_padre para actualizar' }, { status: 400 })
  }

  try {
    const updated = await userService.updatePadre(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error actualizando al padre:", error);
    return NextResponse.json({ error: "Error actualizando al padre" }, { status: 500 })
  }
}