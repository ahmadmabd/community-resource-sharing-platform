"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { MapPin, Phone, LogOut } from "lucide-react";

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

          <div className="mt-4 border-t border-gray-100" />

          {/* Location & Phone */}
          <div className="mt-4 space-y-2.5">
            {userLocation && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#5BB88A]" />
                <span className="text-sm text-gray-600">{userLocation}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#5BB88A]" />
                <span className="text-sm text-gray-600">{phone}</span>
              </div>
            )}
          </div>

          {/* View Profile */}
          <Link
            href={`/user/${userId}`}
            onClick={() => setIsOpen(false)}
            className="mt-4 block w-full rounded-xl bg-[#0F4C35] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0F4C35]/90"
          >
            View Profile
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
