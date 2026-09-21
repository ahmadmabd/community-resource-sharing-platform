"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditProfileFormProps {
  user: {
    id: string;
    name: string;
    phone: string;
    bio: string;
    imageUrl: string;
    location: string;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [imageUrl, setImageUrl] = useState(user.imageUrl);
  const [location, setLocation] = useState(user.location);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          bio,
          imageUrl,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }

      router.push(`/user/${user.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Back */}
      <Link
        href={`/user/${user.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to profile
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update your personal information.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full  rounded-lg border text-black border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900 "
              placeholder="Your name"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900"
              placeholder="Your phone number"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="mt-2 w-full text-black resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900"
              placeholder="Tell the community about yourself..."
            />
          </div>
          {/* lOCATION */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>

            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              rows={1}
              className="mt-2 w-full text-black resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900"
              placeholder="Tell the community about your location..."
            />
          </div>
          {/* IMG */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Profile Image URL
            </label>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2 w-full  text-black rounded-lg border font-black border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href={`/user/${user.id}`}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
