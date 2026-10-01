"use client";

import { useEffect, useState } from "react";

interface ProfileData {
  resourcesCount: number;
  joinDate: string;
}

export default function ProfileStats() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/users/me");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, []);

  if (!profile) {
    return null;
  }

  const joinDate = new Date(profile.joinDate).toLocaleDateString();

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Resources</p>

        <p className="mt-2 text-2xl font-bold text-gray-900">
          {profile.resourcesCount}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Rating</p>

        <p className="mt-2 text-2xl font-bold text-gray-900">⭐ 4.8</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Trust Score</p>

        <p className="mt-2 text-2xl font-bold text-gray-900">96%</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Joined</p>

        <p className="mt-2 text-lg font-bold text-gray-900">{joinDate}</p>
      </div>
    </section>
  );
}
