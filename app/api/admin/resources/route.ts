import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resources = await prisma.resource.findMany({
      select: {
        id: true,
        title: true,
        status: true,

        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: resources,
    });
  } catch (error) {
    console.error("GET RESOURCES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch resources",
      },
      { status: 500 },
    );
  }
}
