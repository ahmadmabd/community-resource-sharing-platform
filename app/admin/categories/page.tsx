"use client";

import { useState, useEffect } from "react";
import { Search, Tag, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

interface Category {
  id: string;
  name: string;
  _count: { resources: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { id: string; name: string; user: { name: string } }[]
  >([]);

  useEffect(() => {
    fetchCategories();
    fetchSuggestions();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories", successToastStyle);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSuggestions() {
    try {
      const res = await fetch("/api/admin/categories/suggestions");
      const data = await res.json();
      setSuggestions(data);
    } catch {
      console.error("Failed to load suggestions");
    }
  }

  async function handleApproveSuggestion(id: string, name: string) {
    try {
      const res = await fetch(
        `/api/admin/categories/suggestions/${id}/approve`,
        {
          method: "PATCH",
        },
      );
      if (!res.ok) {
        toast.error("Failed to approve suggestion", successToastStyle);
        return;
      }
      toast.success(`"${name}" added to categories`, successToastStyle);
      fetchSuggestions();
      fetchCategories();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    }
  }

  async function handleRejectSuggestion(id: string) {
    try {
      const res = await fetch(
        `/api/admin/categories/suggestions/${id}/reject`,
        {
          method: "PATCH",
        },
      );
      if (!res.ok) {
        toast.error("Failed to reject suggestion", successToastStyle);
        return;
      }
      toast.success("Suggestion rejected", successToastStyle);
      fetchSuggestions();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    }
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Category added", successToastStyle);
      setNewName("");
      setShowAdd(false);
      fetchCategories();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(id: string) {
    if (!editingName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Category updated", successToastStyle);
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Category deleted", successToastStyle);
      fetchCategories();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    }
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A1A12]">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F4C35] text-white text-sm font-medium rounded-lg hover:bg-[#0F4C35]/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add category
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5BB88A]/10 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 text-[#5BB88A]" />
          </div>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Category name..."
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="p-2 rounded-lg bg-[#5BB88A]/10 text-[#0F4C35] hover:bg-[#5BB88A]/20 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowAdd(false);
              setNewName("");
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
            Pending suggestions ({suggestions.length})
          </h2>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-[#0A1A12]">{s.name}</p>
                  <p className="text-xs text-gray-400">
                    suggested by {s.user.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveSuggestion(s.id, s.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C35] text-white text-xs font-medium rounded-lg hover:bg-[#0F4C35]/90 transition-colors cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />
            <p className="text-sm text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Resources
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#5BB88A]/10 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-[#5BB88A]" />
                      </div>
                      {editingId === category.id ? (
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSaveEdit(category.id)
                          }
                          className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                        />
                      ) : (
                        <p className="text-sm font-medium text-[#0A1A12]">
                          {category.name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {category._count.resources} resources
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(category.id)}
                            disabled={saving}
                            className="p-1.5 rounded-lg bg-[#5BB88A]/10 text-[#0F4C35] hover:bg-[#5BB88A]/20 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(category.id);
                              setEditingName(category.name);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
}
