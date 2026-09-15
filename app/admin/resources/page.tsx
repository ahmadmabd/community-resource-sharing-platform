"use client";

import { useState } from "react";
import { Search, Package, MoreHorizontal, Eye, Trash2 } from "lucide-react";

const mockResources = [
  { id: "1", title: "Power Drill", owner: "Sara Ali", ownerEmail: "sara@example.com", category: "Tools", status: "AVAILABLE" },
  { id: "2", title: "Camping Tent", owner: "John Doe", ownerEmail: "john@example.com", category: "Outdoors", status: "BORROWED" },
  { id: "3", title: "Stand Mixer", owner: "Ahmad K.", ownerEmail: "ahmad@example.com", category: "Kitchen", status: "AVAILABLE" },
  { id: "4", title: "Bicycle Pump", owner: "Sara Ali", ownerEmail: "sara@example.com", category: "Tools", status: "UNAVAILABLE" },
];

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  AVAILABLE: { label: "Available", dot: "bg-[#5BB88A]", text: "text-[#0F4C35]", bg: "bg-[#5BB88A]/15" },
  BORROWED: { label: "Borrowed", dot: "bg-[#F5A623]", text: "text-amber-700", bg: "bg-[#F5A623]/15" },
  UNAVAILABLE: { label: "Unavailable", dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100" },
};

export default function AdminResourcesPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = mockResources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Resources</h1>
        <p className="text-gray-500 text-sm mt-1">{mockResources.length} listed resources</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Resource</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Owner</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((resource) => {
              const s = statusConfig[resource.status];
              return (
                <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-[#0A1A12]">{resource.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0A1A12]">{resource.owner}</p>
                    <p className="text-xs text-gray-400">{resource.ownerEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{resource.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full`}>
                      <span className={`w-1.5 h-1.5 ${s.dot} rounded-full`} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenu(openMenu === resource.id ? null : resource.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === resource.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No resources found</div>
        )}
      </div>
    </div>
  );
}