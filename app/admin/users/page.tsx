"use client";

import { useState, useEffect } from "react";
import { Search, ShieldCheck, User, MoreHorizontal, Ban, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  suspendReason: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspendModal, setSuspendModal] = useState<{ id: string; name: string } | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspending, setSuspending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load users", successToastStyle);
    } finally {
      setLoading(false);
    }
  }

  async function handleSuspend() {
    if (!suspendModal || !suspendReason.trim()) return;
    setSuspending(true);
    try {
      const res = await fetch(`/api/admin/users/${suspendModal.id}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: suspendReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success(`${suspendModal.name} has been suspended`, successToastStyle);
      setSuspendModal(null);
      setSuspendReason("");
      fetchUsers();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setSuspending(false);
    }
  }

  async function handleUnsuspend(id: string, name: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}/unsuspend`, {
        method: "PATCH",
      });
      if (!res.ok) {
        toast.error("Failed to unsuspend user", successToastStyle);
        return;
      }
      toast.success(`${name} has been reactivated`, successToastStyle);
      fetchUsers();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    }
    setOpenMenu(null);
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading users...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0F4C35]/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-[#0F4C35]">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0A1A12]">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F4C35]/10 text-[#0F4C35] text-xs font-medium rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        <User className="w-3 h-3" />
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {user.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#5BB88A]/15 text-[#0F4C35] text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 bg-[#5BB88A] rounded-full" />
                        Active
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Suspended
                        </span>
                        {user.suspendReason && (
                          <p className="text-xs text-red-400 mt-1 max-w-xs truncate">{user.suspendReason}</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                          {user.status === "ACTIVE" ? (
                            <button
                              onClick={() => {
                                setOpenMenu(null);
                                setSuspendModal({ id: user.id, name: user.name });
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnsuspend(user.id, user.name)}
                              className="w-full text-left px-4 py-2 text-sm text-[#0F4C35] hover:bg-[#5BB88A]/10 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Reactivate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No users found</div>
        )}
      </div>

      {suspendModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#0A1A12]">Suspend {suspendModal.name}</h2>
              <button
                onClick={() => { setSuspendModal(null); setSuspendReason(""); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              This user will be immediately logged out and shown this reason when they try to log in.
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Reason for suspension..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setSuspendModal(null); setSuspendReason(""); }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={suspending || suspendReason.trim().length < 5}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {suspending ? "Suspending..." : "Suspend user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
