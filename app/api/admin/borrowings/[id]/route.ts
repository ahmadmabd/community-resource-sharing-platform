import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const borrowing = await prisma.borrowing.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        borrowedAt: true,
        dueDate: true,
        returnedAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reservationId: true,

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

        reservation: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!borrowing) {
      return NextResponse.json(
        { error: "Borrowing not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: borrowing,
    });
  } catch (error) {
    console.error("GET BORROWING ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch borrowing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
