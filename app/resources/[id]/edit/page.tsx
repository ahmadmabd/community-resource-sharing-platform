"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  condition: string;
  location: string | null;
  city: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
};

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();

  const resourceId = params.id as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load resource + categories
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [resourceResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/resources/${resourceId}`),
          fetch("/api/categories"),
        ]);

        if (!resourceResponse.ok) {
          throw new Error("Failed to load resource");
        }

        if (!categoriesResponse.ok) {
          throw new Error("Failed to load categories");
        }

        const resourceResponseData = await resourceResponse.json();
        const categoriesData = await categoriesResponse.json();

        const resourceData = resourceResponseData.data;

        setResource(resourceData);
        setCategories(categoriesData);

        setTitle(resourceData.title || "");
        setDescription(resourceData.description || "");
        setCondition(resourceData.condition || "");
        setLocation(resourceData.location || "");
        setCity(resourceData.city || "");
        setCategoryId(resourceData.category?.id || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load resource");
      } finally {
        setLoading(false);
      }
    }

    if (resourceId) {
      loadData();
    }
  }, [resourceId]);

  // Submit update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          condition,
          location,
          city,
          categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update resource");
      }

      router.push("/dashboard/resources");
      router.refresh();
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update resource");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 rounded-lg bg-gray-200" />

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="h-10 rounded-lg bg-gray-200" />
                <div className="h-32 rounded-lg bg-gray-200" />
                <div className="h-10 rounded-lg bg-gray-200" />
                <div className="h-10 rounded-lg bg-gray-200" />
                <div className="h-10 rounded-lg bg-gray-200" />
                <div className="h-10 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-red-600">Resource not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900 hover:cursor-pointer"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>

          <p className="mt-1 text-gray-600">
            Update your resource information.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Resource Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter resource title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Describe your resource"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label
              htmlFor="condition"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Condition
            </label>

            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select condition</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Example: Akkar"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              City
            </label>

            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Example: Tripoli"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={() => router.push("/dashboard/resources")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
