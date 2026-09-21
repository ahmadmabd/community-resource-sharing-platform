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

    const report = await prisma.report.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        reason: true,
        description: true,
        status: true,
        adminNote: true,
        createdAt: true,

        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        reportedUser: {
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
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: report,
    });
  } catch (error) {
    console.error("GET REPORT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
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

    const body = await request.json();

    const { status } = body;

    if (!["RESOLVED", "REJECTED", "REVIEWING"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid report status" },
        { status: 400 },
      );
    }

    const report = await prisma.report.findUnique({
      where: {
        id,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updatedReport = await prisma.report.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("UPDATE REPORT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
