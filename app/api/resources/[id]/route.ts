import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
