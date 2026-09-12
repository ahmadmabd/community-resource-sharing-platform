import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const mockUserProfile = {
  id: "user-001",

  name: "Zakaria Hammoud",

  email: "zakaria@example.com",

  image: "src",

  location: "Akkar, Lebanon",

  bio: "Full-Stack Developer and community member interested in technology, education, and resource sharing.",

  joinDate: "September 1, 2026",

  rating: 4.8,

  trustScore: 92,

  resourcesCount: 12,

  totalBorrowings: 18,

  completedBorrowings: 16,

  resources: [
    {
      id: "resource-001",
      name: "Canon Camera",
      category: "Electronics",
      description: "Canon DSLR camera available for community members.",
      status: "Available",
      image: "/images/camera.jpg",
    },
    {
      id: "resource-002",
      name: "MacBook Pro",
      category: "Computers",
      description: "MacBook Pro available for short-term educational use.",
      status: "Borrowed",
      image: "/images/macbook.jpg",
    },
    {
      id: "resource-003",
      name: "Programming Book",
      category: "Books",
      description: "Modern programming and software development book.",
      status: "Available",
      image: "/images/programming-book.jpg",
    },
    {
      id: "resource-004",
      name: "Power Drill",
      category: "Tools",
      description: "Power drill available for community projects.",
      status: "Reserved",
      image: "/images/drill.jpg",
    },
  ],
};

export default async function UserProfilePage({ params }: ProfilePageProps) {
  //   const { id } = await params;

  const user = mockUserProfile;

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
                {(user.name ?? "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

              {user.location && (
                <p className="mt-1 text-sm text-gray-500">📍 {user.location}</p>
              )}

              {user.bio && (
                <p className="mt-3 text-sm text-gray-600">{user.bio}</p>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Resources</p>

            <p className="mt-2 text-2xl font-bold  text-gray-500">
              {user.resources.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Rating</p>

            <p className="mt-2 text-2xl font-bold  text-gray-500">⭐ 4.8</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500  text-gray-500">Trust Score</p>

            <p className="mt-2 text-2xl font-bold  text-gray-500">96%</p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold  text-gray-500">Resources</h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2  text-gray-500">
            {user.resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <h3 className="font-medium">{resource.name}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {resource.category}
                </p>

                {resource.description && (
                  <p className="mt-3 text-sm text-gray-600">
                    {resource.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
