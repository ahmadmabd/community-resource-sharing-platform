import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditProfileForm from "@/components/user/EditProfileForm";

interface EditProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  // Must be logged in
  if (!session) {
    redirect("/login");
  }

  // User can only edit their own profile
  if (session.user.id !== id) {
    redirect(`/user/${id}`);
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <EditProfileForm
      user={{
        id: user.id,
        name: user.name ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        imageUrl: user.imageUrl ?? "",
        location: user.location ?? "",
      }}
    />
  );
}
