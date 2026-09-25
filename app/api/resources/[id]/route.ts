import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      condition: true,
      status: true,
      location: true,
      city: true,

      owner: {
        select: {
          id: true,
          name: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });
  if (!resource) {
    return NextResponse.json({ message: "data not found" }, { status: 404 });
  }
  return NextResponse.json({ data: resource }, { status: 200 });
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find resource first
    const existingResource = await prisma.resource.findUnique({
      where: {
        id,
      },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    // IMPORTANT:
    // User can only edit their own resource
    if (existingResource.ownerId !== session.user.id) {
      return NextResponse.json(
        {
          error: "You are not allowed to edit this resource",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const { title, description, condition, categoryId, location, city } = body;

    // Basic validation
    if (!title || !description || !condition || !categoryId) {
      return NextResponse.json(
        {
          error: "Title, description, condition and category are required",
        },
        { status: 400 },
      );
    }

    // Make sure category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 400 },
      );
    }

    const updatedResource = await prisma.resource.update({
      where: {
        id,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        condition,
        categoryId,
        location: location?.trim() || null,
        city: city?.trim() || null,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error("UPDATE RESOURCE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update resource" },
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

    // 1. Check login
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 2. Find resource
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    // 3. Check ownership
    if (resource.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not allowed to delete this resource" },
        { status: 403 },
      );
    }

    // 4. Guard against deleting a resource with active requests or borrowings
    const activeState = await prisma.borrowRequest.findFirst({
      where: {
        resourceId: id,
        status: { in: ["PENDING", "APPROVED"] },
      },
    });

    const activeBorrowing = await prisma.borrowing.findFirst({
      where: { resourceId: id, status: "ACTIVE" },
    });

    if (activeState || activeBorrowing) {
      return NextResponse.json(
        { error: "Cannot delete a resource with active requests or borrowings" },
        { status: 400 },
      );
    }

    // 5. Delete resource
    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESOURCE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 },
    );
  }
}
