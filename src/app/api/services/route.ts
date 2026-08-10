import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeService(s: { createdAt: Date; [key: string]: unknown }) {
  return { ...s, createdAt: s.createdAt.getTime() };
}

// GET /api/services — pública. Trae todos los servicios de todas las
// categorías de una — el hook los agrupa del lado del cliente con
// servicesFor(categoryId), igual que hacía con localStorage.
export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services.map(serializeService));
}
