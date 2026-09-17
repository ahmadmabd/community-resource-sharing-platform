import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ResourceDetailClient from "./ResourceDetailClient";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const resource = await prisma.resource.findUnique({
    where: { id },
    include: {
      images: true,
      category: { select: { id: true, name: true } },
      owner: {
        select: {
          id: true,
          name: true,
          bio: true,
          createdAt: true,
          _count: {
            select: { resources: true },
          },
        },
      },
      reservations: {
        where: { status: { in: ["CONFIRMED", "PENDING"] } },
        select: { startDate: true, endDate: true },
      },
    },
  });

  if (!resource) notFound();

  const reviews = await prisma.review.findMany({
    where: { revieweeId: resource.ownerId },
    include: {
      reviewer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <ResourceDetailClient
      resource={resource}
      reviews={reviews}
      avgRating={avgRating}
      currentUserId={session?.user?.id ?? null}
      session={session}
    />
  );
}