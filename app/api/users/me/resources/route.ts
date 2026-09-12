// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;

//     const resources = await prisma.resource.findMany({
//       where: {
//         ownerId: userId,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(resources);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to fetch resources" },
//       { status: 500 },
//     );
//   }
// }
