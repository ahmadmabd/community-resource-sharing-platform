import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createRequestSchema = z.object({
  resourceId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  message: z.string().max(500).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.borrowRequest.findMany({
      where: { requesterId: session.user.id },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
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
    const result = createRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { resourceId, startDate, endDate, message } = result.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return NextResponse.json({ error: "Start date cannot be in the past" }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (resource.ownerId === session.user.id) {
      return NextResponse.json({ error: "You cannot borrow your own resource" }, { status: 400 });
    }

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        resourceId,
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
        ],
      },
    });

    if (conflictingReservation) {
      return NextResponse.json({ error: "Resource is not available for these dates" }, { status: 409 });
    }

    const borrowRequest = await prisma.borrowRequest.create({
      data: {
        resourceId,
        requesterId: session.user.id,
        startDate: start,
        endDate: end,
        message,
      },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: resource.ownerId,
        type: "BORROW_REQUEST",
        title: "New borrow request",
        message: `${session.user.name} wants to borrow your "${resource.title}"`,
        link: `/borrow-requests/received`,
      },
    });

    return NextResponse.json(borrowRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}