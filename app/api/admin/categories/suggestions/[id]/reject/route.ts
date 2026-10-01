import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const suggestion = await prisma.categorySuggestion.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json(suggestion);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
