import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeField(f: { createdAt: Date; [key: string]: unknown }) {
  return { ...f, createdAt: f.createdAt.getTime() };
}

// GET /api/fields — pública. Trae todos los campos personalizados de todas
// las categorías de una.
export async function GET() {
  const fields = await prisma.customField.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(fields.map(serializeField));
}
