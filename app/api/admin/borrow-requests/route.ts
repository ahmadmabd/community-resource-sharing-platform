import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await prisma.reservation.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        resource: {
          select: {
            id: true,
            title: true,

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

    // Format the response for the frontend
    const formattedRequests = requests.map((request) => ({
      id: request.id,

      startDate: request.startDate,
      endDate: request.endDate,

      status: request.status,

      user: {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
      },

      resource: {
        id: request.resource.id,
        title: request.resource.title,
      },

      owner: {
        id: request.resource.owner.id,
        name: request.resource.owner.name,
        email: request.resource.owner.email,
      },
    }));

    return NextResponse.json({
      data: formattedRequests,
    });
  } catch (error) {
    console.error("GET /api/admin/borrow-requests error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch borrow requests",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
