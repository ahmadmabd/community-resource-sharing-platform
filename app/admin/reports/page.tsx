"use client";

import { useState } from "react";
import { Search, FileText, MoreHorizontal, Eye, CheckCircle2, Trash2 } from "lucide-react";

const mockReports = [
  { id: "1", reporter: "John Doe", reporterEmail: "john@example.com", type: "Inappropriate Content", reason: "Resource listing contains offensive language", status: "OPEN" },
  { id: "2", reporter: "Sara Ali", reporterEmail: "sara@example.com", type: "Scam", reason: "User never returned borrowed item", status: "REVIEWING" },
  { id: "3", reporter: "Ahmad K.", reporterEmail: "ahmad@example.com", type: "Fake Listing", reason: "Resource does not exist as described", status: "RESOLVED" },
];

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  OPEN: { label: "Open", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-100" },
  REVIEWING: { label: "Reviewing", dot: "bg-[#F5A623]", text: "text-amber-700", bg: "bg-[#F5A623]/15" },
  RESOLVED: { label: "Resolved", dot: "bg-[#5BB88A]", text: "text-[#0F4C35]", bg: "bg-[#5BB88A]/15" },
};

export default function AdminReportsPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = mockReports.filter(
    (r) =>
      r.reporter.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">{mockReports.length} total reports</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reporter</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((report) => {
              const s = statusConfig[report.status];
              return (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-red-500">
                          {report.reporter.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0A1A12]">{report.reporter}</p>
                        <p className="text-xs text-gray-400">{report.reporterEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-[#0A1A12]">{report.type}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-sm text-gray-500 truncate">{report.reason}</p>
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
                        onClick={() => setOpenMenu(openMenu === report.id ? null : report.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === report.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" />
                            View details
                          </button>
                          {report.status !== "RESOLVED" && (
                            <button className="w-full text-left px-4 py-2 text-sm text-[#0F4C35] hover:bg-[#5BB88A]/10 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mark resolved
                            </button>
                          )}
                          <div className="border-t border-gray-100 my-1" />
                          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" />
                            Dismiss
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
          <div className="py-12 text-center text-gray-400 text-sm">No reports found</div>
        )}
      </div>
    </div>
  );
}