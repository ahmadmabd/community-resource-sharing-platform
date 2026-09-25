import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const borrowings = await prisma.borrowing.findMany({
      where: { borrowerId: session.user.id },
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(borrowings);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reservationId } = body;

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        resource: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    if (reservation.resource.ownerId !== session.user.id && reservation.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (reservation.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Reservation is not confirmed" }, { status: 400 });
    }

    const borrowing = await prisma.$transaction(async (tx) => {
      const newBorrowing = await tx.borrowing.create({
        data: {
          resourceId: reservation.resourceId,
          borrowerId: reservation.userId,
          reservationId: reservation.id,
          borrowedAt: reservation.startDate,
          dueDate: reservation.endDate,
          status: "ACTIVE",
        },
      });

      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "COMPLETED" },
      });

      await tx.resource.update({
        where: { id: reservation.resourceId },
        data: { status: "BORROWED" },
      });

      return newBorrowing;
    });

    return NextResponse.json(borrowing, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}