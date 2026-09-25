import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const condition = searchParams.get("condition") || "";
    const city = searchParams.get("city") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const where: any = {
      status: { notIn: ["UNAVAILABLE"] },
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { name: { equals: category, mode: "insensitive" } } }),
      ...(condition && { condition: condition as any }),
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(startDate && endDate && {
        NOT: {
          reservations: {
            some: {
              status: { in: ["CONFIRMED", "PENDING"] },
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) },
            },
          },
        },
      }),
    };

    const resources = await prisma.resource.findMany({
      where,
      include: {
        images: { take: 1 },
        category: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
        reservations: {
          where: { status: { in: ["CONFIRMED", "PENDING"] } },
          select: { startDate: true, endDate: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, condition, categoryId, city, location, imageUrl } = body;

    if (!title || !description || !condition || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        condition,
        categoryId,
        city,
        location,
        ownerId: session.user.id,
        ...(imageUrl && {
          images: {
            create: {
              url: imageUrl,
            },
          },
        }),
      },
      include: {
        images: true,
        category: true,
        owner: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}