"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

export default function ProfileResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        const response = await fetch("/api/users/me/resources");

        if (!response.ok) {
          throw new Error("Failed to load resources");
        }

        const data = await response.json();

        setResources(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Resources</h2>

          <p className="mt-1 text-sm text-gray-500">
            Resources you have added to the platform.
          </p>
        </div>

        <Link
          href="/resources/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Resource
        </Link>
      </div>

      <div className="p-5">
        {loading && (
          <p className="text-sm text-gray-500">Loading resources...</p>
        )}

        {!loading && resources.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              You don&apos;t have any resources yet.
            </p>

            <Link
              href="/resources/new"
              className="mt-3 inline-block text-sm font-medium text-gray-900 underline"
            >
              Add your first resource
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={`/resources/${resource.id}`}
              className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">{resource.name}</h3>

              <p className="mt-1 text-sm text-gray-500">{resource.category}</p>

              {resource.description && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                  {resource.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
