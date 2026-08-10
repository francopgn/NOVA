import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const professional = await prisma.professional.findUnique({
    where: { userId: session.user.id },
    include: {
      pricing: true,
      services: { include: { service: true } },
      customValues: true,
    },
  });

  if (!professional) return NextResponse.json(null);

  return NextResponse.json({
    ...professional,
    createdAt: professional.createdAt.getTime(),
    updatedAt: professional.updatedAt.getTime(),
    selectedServiceIds: professional.services.map((s: { serviceId: string }) => s.serviceId),
    customFieldValues: Object.fromEntries(
      professional.customValues.map((v: { customFieldId: string; valueBoolean: boolean | null; valueText: string | null }) => [
        v.customFieldId,
        v.valueBoolean ?? v.valueText ?? "",
      ])
    ),
  });
}
