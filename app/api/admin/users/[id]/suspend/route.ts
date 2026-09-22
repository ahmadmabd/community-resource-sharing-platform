import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const suspendSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

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

    if (id === session.user.id) {
      return NextResponse.json({ error: "You cannot suspend yourself" }, { status: 400 });
    }

    const body = await req.json();
    const result = suspendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: "SUSPENDED",
        suspendReason: result.data.reason,
      },
      select: { id: true, name: true, status: true, suspendReason: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
