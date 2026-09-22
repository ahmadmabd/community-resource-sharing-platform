import { prisma } from "@/lib/prisma";
export async function GET() {
  const activities = await prisma.activity.findMany({
    select: {
      id: true,
      action: true,
      description: true,
      createdAt: true,
    },
  });
}
