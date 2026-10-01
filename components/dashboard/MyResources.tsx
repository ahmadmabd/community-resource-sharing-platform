"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "./loading";
type ResourceImage = {
  id: string;
  url: string;
};

type Category = {
  id: string;
  name: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  condition: string;
  status: string;
  location: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ResourceImage[];
};

export default function MyResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);

        const response = await fetch("/api/users/me/resources");

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();

        setResources(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your resources.");
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-4 inline-block text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Resources</h1>

          <p className="mt-1 text-sm text-gray-500">
            Resources you have added to ShareHub.
          </p>
        </div>

        <Link
          href="/resources/create"
          className="rounded-lg bg-[#0F4C35] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F4C35]/90"
        >
          + Add Resource
        </Link>
      </div>

      {/* Empty state */}
      {resources.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No resources yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You haven't added any resources yet.
          </p>

          <Link
            href="/resources/create"
            className="mt-5 inline-block rounded-lg bg-[#0F4C35] px-5 py-2 text-sm font-medium text-white hover:bg-[#0F4C35]/90"
          >
            Add Your First Resource
          </Link>
        </div>
      ) : (
        /* Resources */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDelete={(id) => {
                setResources((current) =>
                  current.filter((item) => item.id !== id),
                );
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ResourceCard({
  resource,
  onDelete,
}: {
  resource: Resource;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(`/api/resources/${resource.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete resource.");
        return;
      }

      onDelete(resource.id);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  const imageUrl = resource.images?.[0]?.url;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={resource.title}
          className="h-48 w-full object-cover rounded-t-2xl"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gray-100 text-gray-400">
          No image
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-[#0A1A12]">
            {resource.title}
          </h2>

          <StatusBadge status={resource.status} />
        </div>

        <p className="mb-3 text-sm text-gray-500">{resource.description}</p>

        <div className="space-y-1 text-xs text-gray-500">
          <p>
            <span className="font-medium">Category:</span>{" "}
            {resource.category?.name}
          </p>

          <p>
            <span className="font-medium">Condition:</span>{" "}
            {formatValue(resource.condition)}
          </p>

          {resource.city && (
            <p>
              <span className="font-medium">City:</span> {resource.city}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Link
            href={`/resources/${resource.id}/edit`}
            className="rounded-lg border border-[#0F4C35] px-3 py-2 text-sm font-medium text-[#0F4C35] hover:bg-[#0F4C35]/5"
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: "bg-[#5BB88A]/15 text-[#0F4C35]",
    RESERVED: "bg-amber-100 text-amber-700",
    BORROWED: "bg-blue-100 text-blue-700",
    UNAVAILABLE: "bg-gray-100 text-gray-700",
    ARCHIVED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {formatValue(status)}
    </span>
  );
}

function formatValue(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
