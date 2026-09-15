import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { resourceSchema } from "@/lib/validations/resource";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: resources }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resources:", error);

    return NextResponse.json(
      { message: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = resourceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid resource data",
          errors: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: result.data.categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    // 1. Create the resource
    const newResource = await prisma.resource.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        condition: result.data.condition,
        categoryId: result.data.categoryId,
        location: result.data.location,
        city: result.data.city,
        ownerId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    // 2. Create the image if the user uploaded one
    if (result.data.imageUrl) {
      await prisma.resourceImage.create({
        data: {
          url: result.data.imageUrl,
          resourceId: newResource.id,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Resource created successfully",
        data: newResource,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating resource:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
