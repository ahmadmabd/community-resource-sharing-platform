"use client";

import { useState } from "react";
import { Search, ClipboardList, Eye } from "lucide-react";

const mockRequests = [
  { id: "1", resource: "Power Drill", requester: "John Doe", requesterEmail: "john@example.com", owner: "Sara Ali", startDate: "Sep 15, 2026", endDate: "Sep 20, 2026", status: "PENDING" },
  { id: "2", resource: "Camping Tent", requester: "Ahmad K.", requesterEmail: "ahmad@example.com", owner: "John Doe", startDate: "Sep 18, 2026", endDate: "Sep 25, 2026", status: "APPROVED" },
  { id: "3", resource: "Stand Mixer", requester: "Sara Ali", requesterEmail: "sara@example.com", owner: "Ahmad K.", startDate: "Sep 10, 2026", endDate: "Sep 12, 2026", status: "REJECTED" },
];

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PENDING: { label: "Pending", dot: "bg-[#F5A623]", text: "text-amber-700", bg: "bg-[#F5A623]/15" },
  APPROVED: { label: "Approved", dot: "bg-[#5BB88A]", text: "text-[#0F4C35]", bg: "bg-[#5BB88A]/15" },
  REJECTED: { label: "Rejected", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-100" },
  CANCELLED: { label: "Cancelled", dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100" },
};

export default function AdminBorrowRequestsPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = mockRequests.filter(
    (r) =>
      r.resource.toLowerCase().includes(search.toLowerCase()) ||
      r.requester.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Borrow Requests</h1>
        <p className="text-gray-500 text-sm mt-1">{mockRequests.length} total requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Resource</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Requester</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Owner</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dates</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((req) => {
              const s = statusConfig[req.status];
              return (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                        <ClipboardList className="w-4 h-4 text-[#F5A623]" />
                      </div>
                      <p className="text-sm font-medium text-[#0A1A12]">{req.resource}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0A1A12]">{req.requester}</p>
                    <p className="text-xs text-gray-400">{req.requesterEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{req.owner}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-500">{req.startDate}</p>
                    <p className="text-xs text-gray-400">→ {req.endDate}</p>
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
                        onClick={() => setOpenMenu(openMenu === req.id ? null : req.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === req.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" />
                            View details
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
          <div className="py-12 text-center text-gray-400 text-sm">No requests found</div>
        )}
      </div>
    </div>
  );
}