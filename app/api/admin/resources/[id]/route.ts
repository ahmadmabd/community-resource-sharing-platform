import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const resource = await prisma.resource.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        title: true,
        status: true,
        description: true,
        location: true,

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
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: resource,
    });
  } catch (error) {
    console.error("GET RESOURCE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch resource",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const resource = await prisma.resource.findUnique({
      where: {
        id,
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    await prisma.resource.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESOURCE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete resource",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
