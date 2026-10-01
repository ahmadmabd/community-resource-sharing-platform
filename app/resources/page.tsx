"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, MapPin, Tag, Star, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

type SessionData = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
} | null;

interface Resource {
  id: string;
  title: string;
  description: string;
  condition: string;
  status: string;
  city: string | null;
  images: { url: string }[];
  category: { id: string; name: string };
  owner: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

const conditionMap: Record<string, string> = {
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
};

const conditionColors: Record<string, string> = {
  LIKE_NEW: "bg-[#5BB88A]/15 text-[#0F4C35]",
  GOOD: "bg-blue-100 text-blue-700",
  FAIR: "bg-amber-100 text-amber-700",
};

export default function ResourcesPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchResources();
    fetchSession();
  }, []);

  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data?.user ? data : null);
    } catch {
      setSession(null);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      console.error("Failed to fetch categories");
    }
  }

  async function fetchResources() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedCondition) params.set("condition", selectedCondition);
      if (city) params.set("city", city);

      const res = await fetch(`/api/resources?${params.toString()}`);
      const data = await res.json();
      setResources(data);
    } catch {
      console.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchResources();
  }

  function clearFilters() {
    setSelectedCategory("");
    setSelectedCondition("");
    setCity("");
    setSearch("");
    fetchResources();
  }

  const hasActiveFilters = selectedCategory || selectedCondition || city;

  return (
    <div className="min-h-screen bg-[#F7F8F6]">
      <Navbar session={session} />
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F4C35] text-white text-sm font-medium rounded-xl hover:bg-[#0F4C35]/90 transition-colors cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                  showFilters
                    ? "bg-[#0F4C35] text-white border-[#0F4C35]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
                )}
              </button>
              <Link
                href="/resources/create"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F5A623] text-white text-sm font-medium rounded-xl hover:bg-[#F5A623]/90 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                List item
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {showFilters && (
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-[#0A1A12]">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Condition
                  </label>
                  <div className="space-y-2">
                    {["LIKE_NEW", "GOOD", "FAIR"].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedCondition(selectedCondition === c ? "" : c);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                          selectedCondition === c
                            ? "bg-[#0F4C35] text-white"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {conditionMap[c]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Category
                  </label>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                          selectedCategory === cat.name
                            ? "bg-[#0F4C35] text-white"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Beirut"
                      className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                    />
                  </div>
                </div>

                <button
                  onClick={fetchResources}
                  className="w-full py-2.5 bg-[#0F4C35] text-white text-sm font-medium rounded-xl hover:bg-[#0F4C35]/90 transition-colors cursor-pointer"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </aside>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${resources.length} resources found`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No resources found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[#0F4C35] text-sm font-medium hover:underline mt-2 cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-48 bg-gray-100">
                    {resource.images[0] ? (
                      <img
                        src={resource.images[0].url}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full ${conditionColors[resource.condition]}`}>
                      {conditionMap[resource.condition]}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#0A1A12] mb-1 truncate">{resource.title}</h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {resource.category.name}
                      </span>
                      {resource.city && (
                        <span className="flex items-center gap-0.5 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {resource.city}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/users/${resource.owner.id}`);
                        }}
                        className="flex items-center gap-2 hover:underline cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#0F4C35]/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-[#0F4C35]">
                            {resource.owner.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{resource.owner.name}</span>
                      </div>
                      <span className="text-xs font-medium text-[#5BB88A]">Free</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}