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

//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//       include: {
//         resources: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       image: user.image,
//       location: user.location,
//       bio: user.bio,
//       joinDate: user.createdAt,
//       resourcesCount: user.resources.length,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to fetch user" },
//       { status: 500 },
//     );
//   }
// }

// export async function PATCH(request: Request) {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;

//     const body = await request.json();

//     const { name, location, bio, image } = body;

//     const updatedUser = await prisma.user.update({
//       where: {
//         id: userId,
//       },

//       data: {
//         name,
//         location,
//         bio,
//         image,
//       },
//     });

//     return NextResponse.json({
//       id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       image: updatedUser.image,
//       location: updatedUser.location,
//       bio: updatedUser.bio,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to update profile" },
//       { status: 500 },
//     );
//   }
// }
