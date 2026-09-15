"use client";

import { useState } from "react";
import { Search, Tag, Plus, Pencil, Trash2, X, Check } from "lucide-react";

const initialCategories = [
  { id: "1", name: "Tools", resourceCount: 12 },
  { id: "2", name: "Kitchen", resourceCount: 8 },
  { id: "3", name: "Outdoors", resourceCount: 5 },
  { id: "4", name: "Electronics", resourceCount: 3 },
  { id: "5", name: "Sports", resourceCount: 7 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(id: string, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  function handleSaveEdit(id: string) {
    if (!editingName.trim()) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: editingName.trim() } : c))
    );
    setEditingId(null);
  }

  function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAdd() {
    if (!newName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName.trim(), resourceCount: 0 },
    ]);
    setNewName("");
    setShowAdd(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A1A12]">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F4C35] text-white text-sm font-medium rounded-lg hover:bg-[#0F4C35]/90 transition-colors"
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
            className="p-2 rounded-lg bg-[#5BB88A]/10 text-[#0F4C35] hover:bg-[#5BB88A]/20 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setShowAdd(false); setNewName(""); }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
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

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Resources</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
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
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(category.id)}
                        className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[#0A1A12]">{category.name}</p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {category.resourceCount} resources
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(category.id)}
                          className="p-1.5 rounded-lg bg-[#5BB88A]/10 text-[#0F4C35] hover:bg-[#5BB88A]/20 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(category.id, category.name)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No categories found</div>
        )}
      </div>
    </div>
  );
}