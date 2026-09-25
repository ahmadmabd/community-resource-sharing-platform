import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "CANCEL"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();

    const result = patchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { action } = result.data;

    const borrowRequest = await prisma.borrowRequest.findUnique({
      where: { id },
      include: {
        resource: true,
        reservation: true,
      },
    });

    if (!borrowRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (borrowRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request is no longer pending" },
        { status: 400 },
      );
    }

    // ==========================================
    // CANCEL
    // Only the person who created the request
    // can cancel it.
    // ==========================================

    if (action === "CANCEL") {
      if (borrowRequest.requesterId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const updated = await prisma.borrowRequest.update({
        where: { id },
        data: {
          status: "CANCELLED",
          respondedAt: new Date(),
        },
      });

      return NextResponse.json(updated);
    }

    // ==========================================
    // APPROVE / REJECT
    // Only the resource owner can do these.
    // ==========================================

    if (borrowRequest.resource.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not allowed to respond to this request" },
        { status: 403 },
      );
    }

    // ==========================================
    // REJECT
    // ==========================================

    if (action === "REJECT") {
      const updated = await prisma.borrowRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          respondedAt: new Date(),
        },
      });

      await prisma.notification.create({
        data: {
          userId: borrowRequest.requesterId,
          type: "REQUEST_REJECTED",
          title: "Borrow request declined",
          message: `Your request for "${borrowRequest.resource.title}" was not approved`,
          link: `/borrow-requests`,
        },
      });

      return NextResponse.json(updated);
    }

    // ==========================================
    // APPROVE
    // ==========================================

    if (action === "APPROVE") {
      const result = await prisma.$transaction(async (tx) => {
        // Check for conflicting reservations
        const conflictingReservation = await tx.reservation.findFirst({
          where: {
            resourceId: borrowRequest.resourceId,
            status: {
              in: ["PENDING", "CONFIRMED"],
            },
            startDate: {
              lt: borrowRequest.endDate,
            },
            endDate: {
              gt: borrowRequest.startDate,
            },
          },
        });

        if (conflictingReservation) {
          throw new Error(
            "This resource is already reserved during the requested period",
          );
        }

        // 1. Approve the borrow request
        const updatedRequest = await tx.borrowRequest.update({
          where: {
            id: borrowRequest.id,
          },
          data: {
            status: "APPROVED",
            respondedAt: new Date(),
          },
        });

        // 2. Create reservation for requester
        const reservation = await tx.reservation.create({
          data: {
            resourceId: borrowRequest.resourceId,
            userId: borrowRequest.requesterId,
            borrowRequestId: borrowRequest.id,
            startDate: borrowRequest.startDate,
            endDate: borrowRequest.endDate,
            status: "CONFIRMED",
          },
        });

        // 3. Mark resource as reserved
        const resource = await tx.resource.update({
          where: {
            id: borrowRequest.resourceId,
          },
          data: {
            status: "RESERVED",
          },
        });

        // 4. Activity for requester
        await tx.activity.create({
          data: {
            id: crypto.randomUUID(),
            userId: borrowRequest.requesterId,
            action: "REQUEST_APPROVED",
            description: `Your request to borrow "${borrowRequest.resource.title}" has been approved.`,
            entityId: borrowRequest.id,
            entityType: "BorrowRequest",
          },
        });

        // 5. Activity for owner
        await tx.activity.create({
          data: {
            id: crypto.randomUUID(),
            userId: borrowRequest.resource.ownerId,
            action: "REQUEST_APPROVED",
            description: `You approved the request to borrow "${borrowRequest.resource.title}".`,
            entityId: borrowRequest.id,
            entityType: "BorrowRequest",
          },
        });

        return {
          request: updatedRequest,
          reservation,
          resource,
        };
      });

      await prisma.notification.create({
        data: {
          userId: borrowRequest.requesterId,
          type: "REQUEST_APPROVED",
          title: "Borrow request approved!",
          message: `Your request for "${borrowRequest.resource.title}" has been approved`,
          link: `/reservations`,
        },
      });

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("BORROW REQUEST ACTION ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.borrowRequest.findMany({
      where: {
        requesterId: session.user.id,
      },
      include: {
        resource: {
          include: {
            category: true,
            owner: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("GET MY BORROW REQUESTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load borrow requests" },
      { status: 500 },
    );
  }
}
