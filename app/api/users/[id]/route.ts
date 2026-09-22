import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET USER PROFILE
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1. Get user information
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        imageUrl: true,
        phone: true,
        location: true,
        createdAt: true,

        resources: {
          select: {
            id: true,
            title: true,
            description: true,
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 2. Get ratings from Rating table
    const ratings = await prisma.rating.findMany({
      where: {
        ratedUserId: id,
      },
      select: {
        rating: true,
      },
    });

    // 3. Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
        : 0;

    // 4. Return user + rating information
    return NextResponse.json({
      ...user,
      rating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load profile.",
      },
      { status: 500 },
    );
  }
}

// UPDATE USER PROFILE
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "You cannot edit this profile." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const { name, phone, bio, image, location } = body;

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        phone,
        bio,
        image,
        location,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update profile.",
      },
      { status: 500 },
    );
  }
}
