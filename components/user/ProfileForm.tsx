"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  location: string | null;
  bio: string | null;
}

export default function ProfileForm() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/users/me");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setUser(data);

        setName(data.name ?? "");
        setLocation(data.location ?? "");
        setBio(data.bio ?? "");
        setImage(data.image ?? "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          location,
          bio,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();

      setUser(updatedUser);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update your profile information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Image */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Profile Picture URL
          </label>

          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
          />
        </div>

        {/* Location */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Akkar, Lebanon"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Bio */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community something about yourself..."
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Button */}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
