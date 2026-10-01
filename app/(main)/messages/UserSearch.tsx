"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } catch {
      toast.error("Search failed", successToastStyle);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartChat(userId: string) {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      router.push(`/messages/${data.id}`);
    } catch {
      toast.error("Something went wrong", successToastStyle);
    }
  }

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search people by name..."
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A] shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-sm text-gray-400 text-center">
          Searching...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-sm text-gray-400 text-center">
          No users found
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => handleStartChat(user.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-9 h-9 rounded-full bg-[#0F4C35] flex items-center justify-center text-white text-sm font-medium shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}