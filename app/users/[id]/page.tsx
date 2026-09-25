import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Package, Star, MessageCircle, Calendar } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

const conditionMap: Record<string, string> = {
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
};

const conditionColors: Record<string, string> = {
  LIKE_NEW: "bg-[#5BB88A]/15 text-[#0F4C35]",
  GOOD: "bg-blue-100 text-blue-700",
  FAIR: "bg-amber-100 text-amber-700",
};

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          resources: true,
          reviewsReceived: true,
        },
      },
      resources: {
        where: { status: { notIn: ["UNAVAILABLE"] } },
        include: {
          images: { take: 1 },
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      reviewsReceived: {
        include: {
          reviewer: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) notFound();

  const avgRating =
    user.reviewsReceived.length > 0
      ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        user.reviewsReceived.length
      : null;

  const isOwnProfile = session?.user?.id === id;

  return (
    <div className="min-h-screen bg-[#F7F8F6]">
      <Navbar session={session} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F4C35] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to resources
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0F4C35]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-semibold text-[#0F4C35]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#0A1A12]">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Package className="w-3.5 h-3.5" />
                    {user._count.resources} resources
                  </span>
                  {avgRating && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                      {avgRating.toFixed(1)} ({user._count.reviewsReceived} reviews)
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
                {user.bio && (
                  <p className="text-sm text-gray-500 mt-2 max-w-md">{user.bio}</p>
                )}
              </div>
            </div>

            {!isOwnProfile && session && (
              <Link
                href={`/messages?userId=${user.id}`}
                className="flex items-center gap-2 px-4 py-2 border border-[#0F4C35] text-[#0F4C35] text-sm font-medium rounded-xl hover:bg-[#0F4C35]/5 transition-colors shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Link>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#0A1A12] mb-4">
            {isOwnProfile ? "Your listings" : `${user.name}'s listings`}
          </h2>

          {user.resources.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No resources listed yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-40 bg-gray-100">
                    {resource.images[0] ? (
                      <img
                        src={resource.images[0].url}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full ${conditionColors[resource.condition]}`}>
                      {conditionMap[resource.condition]}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#0A1A12] truncate">{resource.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{resource.category.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {user.reviewsReceived.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-[#0A1A12]">Reviews</h2>
              {avgRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                  <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({user.reviewsReceived.length})</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {user.reviewsReceived.map((review) => (
                <div key={review.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C35]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-[#0F4C35]">
                      {review.reviewer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium text-[#0A1A12]">{review.reviewer.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-[#F5A623] fill-[#F5A623]"
                                : "text-gray-200 fill-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs text-gray-500">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}