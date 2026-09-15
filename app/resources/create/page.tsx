import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import ResourceForm from "@/components/ui/resources/ResourceForm";

export default async function CreateResourcePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F4C35] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to resources
        </Link>
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-green-800">
            Community Resource Sharing
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create a Resource
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            Share something useful with your community. Add the details below so
            other members can easily discover and request your resource.
          </p>
        </div>

        <ResourceForm categories={categories} />
      </div>
    </main>
  );
}
