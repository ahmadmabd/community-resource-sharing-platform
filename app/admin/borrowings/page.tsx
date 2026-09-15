"use client";

import { useState } from "react";
import { Search, BookOpen, MoreHorizontal, Eye } from "lucide-react";

const mockBorrowings = [
  { id: "1", resource: "Power Drill", borrower: "John Doe", borrowerEmail: "john@example.com", startDate: "Sep 10, 2026", dueDate: "Sep 17, 2026", status: "ACTIVE" },
  { id: "2", resource: "Camping Tent", borrower: "Sara Ali", borrowerEmail: "sara@example.com", startDate: "Sep 8, 2026", dueDate: "Sep 12, 2026", status: "OVERDUE" },
  { id: "3", resource: "Stand Mixer", borrower: "Ahmad K.", borrowerEmail: "ahmad@example.com", startDate: "Sep 1, 2026", dueDate: "Sep 8, 2026", status: "RETURNED" },
];

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  ACTIVE: { label: "Active", dot: "bg-[#5BB88A]", text: "text-[#0F4C35]", bg: "bg-[#5BB88A]/15" },
  OVERDUE: { label: "Overdue", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-100" },
  RETURNED: { label: "Returned", dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100" },
};

export default function AdminBorrowingsPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = mockBorrowings.filter(
    (b) =>
      b.resource.toLowerCase().includes(search.toLowerCase()) ||
      b.borrower.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Borrowings</h1>
        <p className="text-gray-500 text-sm mt-1">{mockBorrowings.length} total borrowings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search borrowings..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Resource</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Borrower</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((b) => {
              const s = statusConfig[b.status];
              return (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-[#0A1A12]">{b.resource}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0A1A12]">{b.borrower}</p>
                    <p className="text-xs text-gray-400">{b.borrowerEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{b.startDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${b.status === "OVERDUE" ? "text-red-500" : "text-gray-600"}`}>
                      {b.dueDate}
                    </span>
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
                        onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === b.id && (
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
          <div className="py-12 text-center text-gray-400 text-sm">No borrowings found</div>
        )}
      </div>
    </div>
  );
}