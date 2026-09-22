import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ResourcesSection() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  // const userId = "009dd114-8983-4b5c-b2c8-f2f81dd90290";

  const resources = await prisma.resource.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Resources</h2>

          <p className="mt-1 text-sm text-gray-500">
            Resources you have listed for sharing.
          </p>
        </div>

        <Link
          href="/resources"
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Resources */}
      <div className="divide-y divide-gray-100">
        {resources.length === 0 ? (
          <div className="p-5 text-sm text-gray-500">
            You have not added any resources yet.
          </div>
        ) : (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-5 transition hover:bg-gray-50"
            >
              {/* Resource information */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                  <BookOpen size={20} className="text-gray-600" />
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">
                    {resource.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {resource.category.name}
                  </p>
                </div>
              </div>

              {/* Status */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  resource.status === "AVAILABLE"
                    ? "bg-green-100 text-green-700"
                    : resource.status === "BORROWED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {resource.status.charAt(0) +
                  resource.status.slice(1).toLowerCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
