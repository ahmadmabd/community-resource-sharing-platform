"use client";

import { useState } from "react";
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

interface Props {
  initialName: string;
  initialEmail: string;
}

export default function AdminSettingsForm({ initialName, initialEmail }: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  async function handleProfileSave() {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required", successToastStyle);
      return;
    }
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Profile updated", successToastStyle);
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePasswordSave() {
    if (!currentPassword || !newPassword) {
      toast.error("Both password fields are required", successToastStyle);
      return;
    }
    setLoadingPassword(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Password updated", successToastStyle);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-[#0A1A12] mb-5">Profile information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                  placeholder="Your name"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleProfileSave}
            disabled={loadingProfile}
            className="mt-5 flex items-center gap-2 px-4 py-2 bg-[#0F4C35] text-white text-sm font-medium rounded-lg hover:bg-[#0F4C35]/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loadingProfile ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-[#0A1A12] mb-5">Change password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Current password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrent ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNew ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                  placeholder="Min. 8 characters"
                />
                <button
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handlePasswordSave}
            disabled={loadingPassword}
            className="mt-5 flex items-center gap-2 px-4 py-2 bg-[#0F4C35] text-white text-sm font-medium rounded-lg hover:bg-[#0F4C35]/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loadingPassword ? "Saving..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}