import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // User is not logged in
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const resources = await prisma.resource.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("GET MY RESOURCES ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}
