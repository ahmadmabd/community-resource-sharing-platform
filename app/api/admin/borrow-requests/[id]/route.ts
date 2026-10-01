import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 },
      );
    }

    const borrowRequest = await prisma.reservation.findUnique({
      where: {
        id,
      },

      select: {
        id: true,

        startDate: true,
        endDate: true,

        status: true,

        createdAt: true,
        updatedAt: true,

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

        borrowing: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!borrowRequest) {
      return NextResponse.json(
        { error: "Borrow request not found" },
        { status: 404 },
      );
    }

    const formattedRequest = {
      id: borrowRequest.id,

      startDate: borrowRequest.startDate,
      endDate: borrowRequest.endDate,

      status: borrowRequest.status,

      createdAt: borrowRequest.createdAt,
      updatedAt: borrowRequest.updatedAt,

      user: {
        id: borrowRequest.user.id,
        name: borrowRequest.user.name,
        email: borrowRequest.user.email,
      },

      resource: {
        id: borrowRequest.resource.id,
        title: borrowRequest.resource.title,
      },

      owner: {
        id: borrowRequest.resource.owner.id,
        name: borrowRequest.resource.owner.name,
        email: borrowRequest.resource.owner.email,
      },

      borrowing: borrowRequest.borrowing
        ? {
            id: borrowRequest.borrowing.id,
          }
        : null,
    };

    return NextResponse.json({
      data: formattedRequest,
    });
  } catch (error) {
    console.error("GET /api/admin/borrow-requests/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch borrow request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
