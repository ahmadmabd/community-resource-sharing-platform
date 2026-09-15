import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const suggestSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = suggestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const existing = await prisma.category.findFirst({
      where: { name: { equals: result.data.name, mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json({ error: "This category already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Suggestion received! Admin will review it." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}