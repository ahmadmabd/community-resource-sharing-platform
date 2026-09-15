import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ResourceCard from "@/components/ui/resources/ResourceCard";
import SearchBar from "@/components/ui/resources/SearchBar";
import { prisma } from "@/lib/prisma";
import FocusedResource from "@/components/ui/resources/FocusedResource";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { search } = await searchParams;

  const resources = await prisma.resource.findMany({
    where: search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,

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

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Navbar */}
      <Navbar session={session} />

      {/* Page content */}
      <main className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#0F4C35]">
                Community Resources
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Available Resources
              </h1>

              <p className="mt-2 max-w-2xl text-gray-500">
                Discover resources shared by members of the community.
              </p>
            </div>

            {/* Create resource */}
            <Link
              href="/resources/create"
              className="inline-flex items-center justify-center rounded-xl bg-[#0F4C35] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0D3F2C] hover:shadow-md"
            >
              + Create Resource
            </Link>
          </div>

          {/* Search */}
          <div className="mb-8 p-4 pt-10">
            <SearchBar />
          </div>

          {/* Focused resource */}
          <FocusedResource resourceId={search ? resources[0]?.id : undefined} />

          {/* Results */}
          {resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                No resources found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or create a new resource.
              </p>

              <Link
                href="/resources/create"
                className="mt-5 inline-flex rounded-xl bg-[#0F4C35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0D3F2C]"
              >
                Create Resource
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Community Resources
                </h2>

                <span className="rounded-full bg-[#E7F0EA] px-3 py-1 text-sm font-medium text-[#0F4C35]">
                  {resources.length}{" "}
                  {resources.length === 1 ? "resource" : "resources"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {resources.map((item) => (
                  <ResourceCard
                    key={item.id}
                    title={item.title}
                    imageUrl={item.images[0]?.url}
                    location={item.location ?? "Unknown location"}
                    condition={item.condition}
                    status={item.status}
                    id={item.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
