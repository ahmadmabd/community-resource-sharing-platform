"use client";

import { useEffect, useState } from "react";
import { Search, ClipboardList, Eye, X } from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    dot: string;
    text: string;
    bg: string;
  }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-[#F5A623]",
    text: "text-amber-700",
    bg: "bg-[#F5A623]/15",
  },

  APPROVED: {
    label: "Approved",
    dot: "bg-[#5BB88A]",
    text: "text-[#0F4C35]",
    bg: "bg-[#5BB88A]/15",
  },

  REJECTED: {
    label: "Rejected",
    dot: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-100",
  },

  CANCELLED: {
    label: "Cancelled",
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
};

type BorrowRequest = {
  id: string;

  startDate: string;
  endDate: string;

  status: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  owner: {
    id: string;
    name: string;
    email: string;
  };

  resource: {
    id: string;
    title: string;
  };
};

type BorrowRequestDetails = {
  id: string;

  startDate: string;
  endDate: string;

  status: string;

  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  owner: {
    id: string;
    name: string;
    email: string;
  };

  resource: {
    id: string;
    title: string;
  };

  borrowing: {
    id: string;
  } | null;
};

export default function AdminBorrowRequestsPage() {
  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [requests, setRequests] = useState<BorrowRequest[]>([]);

  const [loadingRequests, setLoadingRequests] = useState(true);

  const [loadingRequest, setLoadingRequest] = useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState<BorrowRequestDetails | null>(null);

  const [error, setError] = useState("");

  // Fetch all borrow requests
  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoadingRequests(true);
      setError("");

      const res = await fetch("/api/admin/borrow-requests");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch borrow requests",
        );
      }

      setRequests(data.data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load borrow requests",
      );
    } finally {
      setLoadingRequests(false);
    }
  }

  // Fetch one request for View Details
  async function fetchRequest(id: string) {
    try {
      setLoadingRequest(true);
      setError("");

      const res = await fetch(`/api/admin/borrow-requests/${id}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch request",
        );
      }

      setSelectedRequest(data.data);

      setOpenMenu(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load request details",
      );
    } finally {
      setLoadingRequest(false);
    }
  }

  function closeModal() {
    setSelectedRequest(null);
  }

  const filtered = requests.filter(
    (request) =>
      request.resource.title.toLowerCase().includes(search.toLowerCase()) ||
      request.user.name.toLowerCase().includes(search.toLowerCase()) ||
      request.owner.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">
          Borrow Requests
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          {requests.length} total requests
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Search */}
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

        {/* Loading */}
        {loadingRequests ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

            <p className="text-sm text-gray-400">Loading borrow requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No requests found
          </div>
        ) : (
          /* Table */
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Resource
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Requester
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Owner
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Dates
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="px-5 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filtered.map((request) => {
                const s = statusConfig[request.status] ?? {
                  label: request.status,
                  dot: "bg-gray-400",
                  text: "text-gray-600",
                  bg: "bg-gray-100",
                };

                return (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Resource */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                          <ClipboardList className="w-4 h-4 text-[#F5A623]" />
                        </div>

                        <p className="text-sm font-medium text-[#0A1A12]">
                          {request.resource.title}
                        </p>
                      </div>
                    </td>

                    {/* Requester */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#0A1A12]">
                        {request.user.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {request.user.email}
                      </p>
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {request.owner.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {request.owner.email}
                      </p>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-500">
                        {new Date(request.startDate).toLocaleDateString()}
                      </p>

                      <p className="text-xs text-gray-400">
                        → {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full`}
                      >
                        <span className={`w-1.5 h-1.5 ${s.dot} rounded-full`} />

                        {s.label}
                      </span>
                    </td>

                    {/* Menu */}
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === request.id ? null : request.id,
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>

                        {openMenu === request.id && (
                          <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                            <button
                              onClick={() => fetchRequest(request.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                            >
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
        )}
      </div>

      {/* Loading Details */}
      {loadingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

              <p className="text-sm text-gray-600">Loading request...</p>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-[#0A1A12]">
                  Borrow Request Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  View request information
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Resource */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Resource
                </p>

                <p className="text-sm font-medium text-[#0A1A12] mt-1">
                  {selectedRequest.resource.title}
                </p>
              </div>

              {/* Requester */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Requester
                </p>

                <p className="text-sm font-medium text-[#0A1A12] mt-1">
                  {selectedRequest.user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedRequest.user.email}
                </p>
              </div>

              {/* Owner */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Owner
                </p>

                <p className="text-sm font-medium text-[#0A1A12] mt-1">
                  {selectedRequest.owner.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedRequest.owner.email}
                </p>
              </div>

              {/* Start Date */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Start Date
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedRequest.startDate).toLocaleString()}
                </p>
              </div>

              {/* End Date */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  End Date
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedRequest.endDate).toLocaleString()}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </p>

                <div className="mt-1">
                  {(() => {
                    const s = statusConfig[selectedRequest.status] ?? {
                      label: selectedRequest.status,
                      dot: "bg-gray-400",
                      text: "text-gray-600",
                      bg: "bg-gray-100",
                    };

                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full`}
                      >
                        <span className={`w-1.5 h-1.5 ${s.dot} rounded-full`} />

                        {s.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Borrowing */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Borrowing
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {selectedRequest.borrowing ? "Created" : "No borrowing yet"}
                </p>
              </div>

              {/* Created At */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Created At
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Updated At */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Updated At
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedRequest.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
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
