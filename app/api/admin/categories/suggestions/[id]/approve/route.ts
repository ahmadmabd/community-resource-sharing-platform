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

    const suggestion = await prisma.categorySuggestion.findUnique({
      where: { id },
    });

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    const existing = await prisma.category.findFirst({
      where: { name: { equals: suggestion.name, mode: "insensitive" } },
    });

    if (existing) {
      await prisma.categorySuggestion.update({
        where: { id },
        data: { status: "APPROVED" },
      });
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.category.create({
        data: { name: suggestion.name },
      });
      await tx.categorySuggestion.update({
        where: { id },
        data: { status: "APPROVED" },
      });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
