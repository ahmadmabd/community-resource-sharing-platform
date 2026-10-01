import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, MapPin, Phone, Star } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  // Get current logged-in session
  const session = await getServerSession(authOptions);

  // Get the user from Prisma
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      resources: {
        include: {
          category: true,
          images: true,
        },
      },
    },
  });
  const ratings = await prisma.review.findMany({
    where: {
      revieweeId: id,
    },
    select: {
      rating: true,
    },
  });
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
      : 0;
  if (!user) {
    notFound();
  }

  // Check if this profile belongs to the logged-in user
  const isOwner = session?.user?.id === user.id;

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* Profile Header */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side */}
            <div className="flex items-center gap-5">
              {/* Profile Image */}
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name ?? "User"}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0F4C35]/10 text-3xl font-bold text-[#0F4C35]">
                  {(user.name ?? "U").charAt(0).toUpperCase()}
                </div>
              )}

              {/* User Information */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                {user.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={14} className="text-[#5BB88A]" />
                    {user.location}
                  </p>
                )}
                {user.phone && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone size={14} className="text-[#5BB88A]" />
                    {user.phone}
                  </p>
                )}

                {user.bio && (
                  <p className="mt-3 max-w-2xl text-sm text-gray-600">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Edit button */}
            {isOwner && (
              <Link
                href={`/user/${user.id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C35] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0F4C35]/90"
              >
                <Pencil size={16} />
                Edit Profile
              </Link>
            )}
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Resources */}
          <div className="rounded-xl border border-gray-200 border-l-4 border-l-[#5BB88A] bg-white p-5">
            <p className="text-sm text-gray-500">Resources</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {user.resources.length}
            </p>
          </div>

          {/* Rating */}
          <div className="rounded-xl border border-gray-200 border-l-4 border-l-[#F5A623] bg-white p-5">
            <p className="text-sm text-gray-500">Rating</p>

            <p className="mt-2 flex items-center gap-1.5 text-2xl font-bold text-gray-900">
              <Star size={20} className="text-[#F5A623] fill-[#F5A623]" />
              {averageRating.toFixed(1)}
            </p>
          </div>

          {/* Trust Score */}
          <div className="rounded-xl border border-gray-200 border-l-4 border-l-purple-400 bg-white p-5">
            <p className="text-sm text-gray-500">Trust Score</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">N/A</p>
          </div>
        </section>

        {/* Resources */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Resources</h2>

          {user.resources.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">
              This user has no resources yet.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {user.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {resource.images[0]?.url && (
                    <img
                      src={resource.images[0].url}
                      alt={resource.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <h3 className="font-medium text-[#0A1A12]">
                      {resource.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {resource.category.name}
                    </p>

                    {resource.description && (
                      <p className="mt-3 text-sm text-gray-600">
                        {resource.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
