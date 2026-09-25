import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  borrowingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { borrowingId, rating, comment } = result.data;

    const borrowing = await prisma.borrowing.findUnique({
      where: { id: borrowingId },
      include: { resource: true },
    });

    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing not found" }, { status: 404 });
    }

    if (borrowing.borrowerId !== session.user.id) {
      return NextResponse.json({ error: "Only the borrower can leave a review" }, { status: 403 });
    }

    if (borrowing.status !== "RETURNED") {
      return NextResponse.json({ error: "Item must be returned before reviewing" }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { borrowingId },
    });

    if (existing) {
      return NextResponse.json({ error: "You already reviewed this borrowing" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        borrowingId,
        reviewerId: session.user.id,
        revieweeId: borrowing.resource.ownerId,
        rating,
        comment,
      },
    });

    await prisma.notification.create({
      data: {
        userId: borrowing.resource.ownerId,
        type: "REVIEW_RECEIVED",
        title: "You received a new review!",
        message: `Someone left you a ${rating}-star review`,
        link: `/users/${borrowing.resource.ownerId}`,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
