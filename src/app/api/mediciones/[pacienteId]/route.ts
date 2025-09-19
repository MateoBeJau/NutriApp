import { NextRequest, NextResponse } from "next/server";
import { getMedicionesByPaciente } from "@/services/mediciones";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pacienteId: string }> }
) {
  try {
    const { pacienteId } = await params;
    
    const mediciones = await getMedicionesByPaciente(pacienteId);
    
    return NextResponse.json(mediciones);
  } catch (error) {
    console.error("Error fetching mediciones:", error);
    return NextResponse.json(
      { error: "Error al obtener mediciones" },
      { status: 500 }
    );
  }
}
