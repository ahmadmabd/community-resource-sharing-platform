"use client";

import { useState } from "react";
import Link from "next/link";

type UserProfileCardProps = {
  userId: string;
  userName: string;
  userImage?: string | null;
  bio?: string | null;
  phone?: string | null;
  userLocation?: string | null;
};

export default function UserProfileCard({
  userId,
  userName,
  userImage,
  bio,
  phone,
  userLocation,
}: UserProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Avatar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open user profile card"
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-full w-full object-cover"
          />
        ) : (
          userName.charAt(0).toUpperCase()
        )}
      </button>

      {/* Floating Profile Card */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
          {/* User Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-lg font-bold text-white">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-gray-900">
                {userName}
              </h3>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="mt-4 line-clamp-2 text-sm leading-5 text-gray-600">
              {bio}
            </p>
          )}

          {/* Location */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {userLocation !== undefined && (
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">Location</p>
                <p className="mt-1 font-bold text-gray-900">
                  📍 {userLocation}
                </p>
              </div>
            )}
            {phone !== undefined && (
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">Phone:</p>
                <p className="mt-1 font-bold text-gray-900">📞 {phone}</p>
              </div>
            )}
          </div>

          {/* View Profile */}
          <Link
            href={`/user/${userId}`}
            onClick={() => setIsOpen(false)}
            className="mt-4 block w-full rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View Profile
          </Link>
        </div>
      )}
    </div>
  );
}
