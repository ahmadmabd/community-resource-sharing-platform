import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const borrowing = await prisma.borrowing.findUnique({
      where: { id },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            images: { take: 1 },
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing not found" }, { status: 404 });
    }

    if (borrowing.borrowerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(borrowing);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const borrowing = await prisma.borrowing.findUnique({
      where: { id },
    });

    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing not found" }, { status: 404 });
    }

    if (borrowing.borrowerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (borrowing.status !== "ACTIVE") {
      return NextResponse.json({ error: "Borrowing is not active" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedBorrowing = await tx.borrowing.update({
        where: { id },
        data: {
          status: "RETURNED",
          returnedAt: new Date(),
        },
      });

      if (borrowing.reservationId) {
        await tx.reservation.update({
          where: { id: borrowing.reservationId },
          data: { status: "COMPLETED" },
        });
      }

      return updatedBorrowing;
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}