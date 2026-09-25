"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

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
    <div className="min-h-screen bg-[#F7F8F6] p-6 sm:p-8">
      {/* Back */}
      <Link
        href={`/user/${user.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to profile
      </Link>

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[#0A1A12]">Edit Profile</h1>

        <p className="mt-1 mb-6 text-sm text-gray-500">
          Update your personal information
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#5BB88A] focus:ring-2 focus:ring-[#5BB88A]/30"
              placeholder="Your name"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Phone
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#5BB88A] focus:ring-2 focus:ring-[#5BB88A]/30"
              placeholder="Your phone number"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#5BB88A] focus:ring-2 focus:ring-[#5BB88A]/30"
              placeholder="Tell the community about yourself..."
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Location
            </label>

            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              rows={1}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#5BB88A] focus:ring-2 focus:ring-[#5BB88A]/30"
              placeholder="Tell the community about your location..."
            />
          </div>

          {/* Profile Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Profile Image
            </label>

            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
              {imageUrl ? (
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-gray-600 shadow hover:bg-gray-50"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button:
                      "!bg-[#0F4C35] text-white text-sm font-medium rounded-xl px-6 py-2.5 hover:!bg-[#0F4C35]/90 transition-colors cursor-pointer ut-uploading:!bg-[#0F4C35]/70 ut-uploading:cursor-not-allowed",
                    container: "w-full flex justify-center",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.ufsUrl) setImageUrl(res[0].ufsUrl);
                  }}
                  onUploadError={(uploadError: Error) => {
                    toast.error(
                      `Upload failed: ${uploadError.message}`,
                      successToastStyle,
                    );
                  }}
                />
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <Link
              href={`/user/${user.id}`}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#0F4C35] px-6 py-2.5 text-sm text-white hover:bg-[#0F4C35]/90 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
