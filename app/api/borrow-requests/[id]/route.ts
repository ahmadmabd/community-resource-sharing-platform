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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = patchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { action } = result.data;

    const borrowRequest = await prisma.borrowRequest.findUnique({
      where: { id },
      include: { resource: true },
    });

    if (!borrowRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (borrowRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Request is no longer pending" }, { status: 400 });
    }

    if (action === "CANCEL") {
      if (borrowRequest.requesterId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      const updated = await prisma.borrowRequest.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "APPROVE" || action === "REJECT") {
      if (borrowRequest.resource.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      if (action === "REJECT") {
        const updated = await prisma.borrowRequest.update({
          where: { id },
          data: { status: "REJECTED" },
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

      const updated = await prisma.$transaction(async (tx) => {
        const updatedRequest = await tx.borrowRequest.update({
          where: { id },
          data: { status: "APPROVED" },
        });

        await tx.reservation.create({
          data: {
            resourceId: borrowRequest.resourceId,
            userId: borrowRequest.requesterId,
            borrowRequestId: borrowRequest.id,
            startDate: borrowRequest.startDate,
            endDate: borrowRequest.endDate,
            status: "CONFIRMED",
          },
        });

        return updatedRequest;
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

      return NextResponse.json(updated);
    }
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}