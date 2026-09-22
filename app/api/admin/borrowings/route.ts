import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const borrowings = await prisma.borrowing.findMany({
      select: {
        id: true,
        borrowedAt: true,
        dueDate: true,
        status: true,

        resource: {
          select: {
            id: true,
            title: true,
          },
        },

        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: borrowings,
    });
  } catch (error) {
    console.error("GET BORROWINGS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch borrowings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
