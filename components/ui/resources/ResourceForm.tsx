"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PackagePlus,
  FileText,
  MapPin,
  Tag,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { UploadButton } from "@/lib/uploadthing";

type Category = {
  id: string;
  name: string;
};

type ResourceFormProps = {
  categories: Category[];
};

function ResourceForm({ categories }: ResourceFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");

  // Image URL
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const resource = {
      title,
      description,
      categoryId,
      condition,
      location,
      city,
      imageUrl,
    };

    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create resource");
        return;
      }

      setSuccess("Resource created successfully!");

      setTitle("");
      setDescription("");
      setCategoryId("");
      setCondition("");
      setLocation("");
      setCity("");
      setImageUrl("");

      setTimeout(() => {
        router.push("/resources");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-white shadow-sm">
            <PackagePlus size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Resource Information
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Tell the community about the resource you want to share.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="space-y-8">
          {/* Basic Information */}

          <section>
            <div className="mb-5 flex items-center gap-2">
              <FileText size={18} className="text-green-700" />

              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="grid gap-5">
              {/* Title */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Resource title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mountain Bike"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-blue-100"
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
                  placeholder="Describe the resource, how it can be used, and any important details..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  A clear description helps other community members understand
                  your resource.
                </p>
              </div>
            </div>
          </section>

          {/* Category & Condition */}

          <section>
            <div className="mb-5 flex items-center gap-2">
              <Tag size={18} className="text-green-700" />

              <h3 className="font-semibold text-gray-900">
                Category & Condition
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select condition</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
            </div>
          </section>

          {/* Location */}

          <section>
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-green-700" />

              <h3 className="font-semibold text-gray-900">Location</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                  placeholder="e.g. Hamra Street"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-blue-100"
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
                  placeholder="e.g. Beirut"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Image */}

          <section>
            <div className="mb-5 flex items-center gap-2">
              <PackagePlus size={18} className="text-green-700" />

              <h3 className="font-semibold text-gray-900">Resource Image</h3>
            </div>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
              <p className="mb-4 text-sm text-gray-600">
                Add a picture of the resource. Maximum size: 4MB.
              </p>

              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setImageUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  setError(`Upload failed: ${error.message}`);
                }}
              />

              {imageUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-green-700">
                    Image uploaded successfully!
                  </p>

                  <img
                    src={imageUrl}
                    alt="Resource preview"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Messages */}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />

              <div>
                <p className="font-medium">Could not create resource</p>

                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />

              <div>
                <p className="font-medium">Success</p>

                <p className="mt-1">{success}</p>
              </div>
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => router.push("/resources")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium hover:cursor-pointer text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Create Resource
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResourceForm;
