"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Trash2,
  X,
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-100",
  },
  REVIEWING: {
    label: "Reviewing",
    dot: "bg-[#F5A623]",
    text: "text-amber-700",
    bg: "bg-[#F5A623]/15",
  },
  RESOLVED: {
    label: "Resolved",
    dot: "bg-[#5BB88A]",
    text: "text-[#0F4C35]",
    bg: "bg-[#5BB88A]/15",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
};

type Report = {
  id: string;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: string;
};

type ReportDetails = {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;

  reporter: {
    id: string;
    name: string;
    email: string;
  };

  reportedUser: {
    id: string;
    name: string;
    email: string;
  } | null;

  resource: {
    id: string;
    title: string;
  } | null;
};

export default function AdminReportsPage() {
  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [reports, setReports] = useState<Report[]>([]);

  const [loadingReports, setLoadingReports] = useState(true);

  const [loadingReport, setLoadingReport] = useState(false);

  const [selectedReport, setSelectedReport] = useState<ReportDetails | null>(
    null,
  );

  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoadingReports(true);
      setError("");

      const res = await fetch("/api/admin/reports");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch reports",
        );
      }

      setReports(data.data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to load reports",
      );
    } finally {
      setLoadingReports(false);
    }
  }

  async function fetchReport(id: string) {
    try {
      setLoadingReport(true);
      setError("");

      const res = await fetch(`/api/admin/reports/${id}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to fetch report");
      }

      setSelectedReport(data.data);
      setOpenMenu(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load report details",
      );
    } finally {
      setLoadingReport(false);
    }
  }

  async function updateReportStatus(
    id: string,
    status: "RESOLVED" | "REJECTED",
  ) {
    const message =
      status === "RESOLVED"
        ? "Are you sure you want to mark this report as resolved?"
        : "Are you sure you want to dismiss this report?";

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    try {
      setError("");

      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to update report",
        );
      }

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === id
            ? {
                ...report,
                status,
              }
            : report,
        ),
      );

      setSelectedReport((currentReport) =>
        currentReport?.id === id
          ? {
              ...currentReport,
              status,
            }
          : currentReport,
      );

      setOpenMenu(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to update report",
      );
    }
  }

  function closeModal() {
    setSelectedReport(null);
  }

  const filtered = reports.filter(
    (report) =>
      report.reporter.name.toLowerCase().includes(search.toLowerCase()) ||
      report.reason.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Reports</h1>

        <p className="text-gray-500 text-sm mt-1">
          {reports.length} total reports
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {/* Search */}
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

        {/* Loading */}
        {loadingReports ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

            <p className="text-sm text-gray-400">Loading reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty */
          <div className="py-16 text-center text-gray-400 text-sm">
            No reports found
          </div>
        ) : (
          /* Table */
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Reporter
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Reason
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="px-5 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filtered.map((report) => {
                const s = statusConfig[report.status];

                return (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Reporter */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-red-500">
                            {report.reporter.name.charAt(0)}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#0A1A12]">
                            {report.reporter.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {report.reporter.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-sm text-gray-500 truncate">
                        {report.reason}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s?.bg ?? "bg-gray-100"} ${s?.text ?? "text-gray-600"} text-xs font-medium rounded-full`}
                      >
                        <span
                          className={`w-1.5 h-1.5 ${s?.dot ?? "bg-gray-400"} rounded-full`}
                        />

                        {s?.label ?? report.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block z-50">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === report.id ? null : report.id,
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500 hover:cursor-pointer" />
                        </button>

                        {openMenu === report.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                            {/* View */}
                            <button
                              onClick={() => fetchReport(report.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 hover:cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 hover:cursor-pointer" />
                              View details
                            </button>

                            {/* Resolve */}
                            {report.status !== "RESOLVED" && (
                              <button
                                onClick={() =>
                                  updateReportStatus(report.id, "RESOLVED")
                                }
                                className="w-full text-left px-4 py-2 text-sm text-[#0F4C35] hover:bg-[#5BB88A]/10 flex items-center gap-2 hover:cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 hover:cursor-pointer" />
                                Mark resolved
                              </button>
                            )}

                            {/* Dismiss */}
                            {report.status !== "REJECTED" && (
                              <>
                                <div className="border-t border-gray-100 my-1" />

                                <button
                                  onClick={() =>
                                    updateReportStatus(report.id, "REJECTED")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 hover:cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 hover:cursor-pointer" />
                                  Dismiss
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Loading details */}
      {loadingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

              <p className="text-sm text-gray-600">Loading report...</p>
            </div>
          </div>
        </div>
      )}

      {/* Report details modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-[#0A1A12]">
                  Report details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Report ID: {selectedReport.id}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500 hover:cursor-pointer" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">
              {/* Reporter */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Reporter
                </p>

                <p className="text-sm font-medium text-[#0A1A12]">
                  {selectedReport.reporter.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedReport.reporter.email}
                </p>
              </div>

              {/* Reported user */}
              {selectedReport.reportedUser && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Reported user
                  </p>

                  <p className="text-sm font-medium text-[#0A1A12]">
                    {selectedReport.reportedUser.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedReport.reportedUser.email}
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Reason
                </p>

                <p className="text-sm text-gray-700">{selectedReport.reason}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </p>

                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedReport.description || "No description provided"}
                </p>
              </div>

              {/* Resource */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Resource
                </p>

                {selectedReport.resource ? (
                  <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-[#0A1A12]">
                      {selectedReport.resource.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      ID: {selectedReport.resource.id}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    No resource associated with this report
                  </p>
                )}
              </div>

              {/* Created at */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Created at
                </p>

                <p className="text-sm text-gray-700">
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Status
                </p>

                {(() => {
                  const s = statusConfig[selectedReport.status];

                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s?.bg ?? "bg-gray-100"} ${s?.text ?? "text-gray-600"} text-xs font-medium rounded-full`}
                    >
                      <span
                        className={`w-1.5 h-1.5 ${s?.dot ?? "bg-gray-400"} rounded-full`}
                      />

                      {s?.label ?? selectedReport.status}
                    </span>
                  );
                })()}
              </div>

              {/* Admin note */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Admin note
                </p>

                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedReport.adminNote || "No admin note"}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              {selectedReport.status !== "RESOLVED" && (
                <button
                  onClick={() =>
                    updateReportStatus(selectedReport.id, "RESOLVED")
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0F4C35] rounded-lg hover:bg-[#0A3B29] transition-colors hover:cursor-pointer"
                >
                  Mark resolved
                </button>
              )}

              {selectedReport.status !== "REJECTED" && (
                <button
                  onClick={() =>
                    updateReportStatus(selectedReport.id, "REJECTED")
                  }
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors hover:cursor-pointer"
                >
                  Dismiss
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
