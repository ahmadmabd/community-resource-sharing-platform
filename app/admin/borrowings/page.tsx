"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, MoreHorizontal, Eye, X } from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    dot: string;
    text: string;
    bg: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    dot: "bg-[#5BB88A]",
    text: "text-[#0F4C35]",
    bg: "bg-[#5BB88A]/15",
  },

  OVERDUE: {
    label: "Overdue",
    dot: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-100",
  },

  RETURNED: {
    label: "Returned",
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
};

type Borrowing = {
  id: string;
  borrowedAt: string;
  dueDate: string;
  status: string;

  resource: {
    id: string;
    title: string;
  };

  borrower: {
    id: string;
    name: string;
    email: string;
  };
};

type BorrowingDetails = {
  id: string;

  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: string;

  createdAt: string;
  updatedAt: string;

  reservationId: string | null;

  resource: {
    id: string;
    title: string;
  };

  borrower: {
    id: string;
    name: string;
    email: string;
  };

  reservation: {
    id: string;
  } | null;
};

export default function AdminBorrowingsPage() {
  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);

  const [loadingBorrowings, setLoadingBorrowings] = useState(true);

  const [loadingBorrowing, setLoadingBorrowing] = useState(false);

  const [selectedBorrowing, setSelectedBorrowing] =
    useState<BorrowingDetails | null>(null);

  const [error, setError] = useState("");

  // Fetch all borrowings
  useEffect(() => {
    fetchBorrowings();
  }, []);

  async function fetchBorrowings() {
    try {
      setLoadingBorrowings(true);
      setError("");

      const res = await fetch("/api/admin/borrowings");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch borrowings",
        );
      }

      setBorrowings(data.data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to load borrowings",
      );
    } finally {
      setLoadingBorrowings(false);
    }
  }

  // Fetch one borrowing for View Details
  async function fetchBorrowing(id: string) {
    try {
      setLoadingBorrowing(true);
      setError("");

      const res = await fetch(`/api/admin/borrowings/${id}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch borrowing",
        );
      }

      setSelectedBorrowing(data.data);

      setOpenMenu(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load borrowing details",
      );
    } finally {
      setLoadingBorrowing(false);
    }
  }

  function closeModal() {
    setSelectedBorrowing(null);
  }

  const filtered = borrowings.filter(
    (borrowing) =>
      borrowing.resource.title.toLowerCase().includes(search.toLowerCase()) ||
      borrowing.borrower.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Borrowings</h1>

        <p className="text-gray-500 text-sm mt-1">
          {borrowings.length} total borrowings
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
              placeholder="Search borrowings..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        {/* Loading */}
        {loadingBorrowings ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

            <p className="text-sm text-gray-400">Loading borrowings...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty */
          <div className="py-12 text-center text-gray-400 text-sm">
            No borrowings found
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
                  Borrower
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Start Date
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Due Date
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="px-5 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filtered.map((borrowing) => {
                const s = statusConfig[borrowing.status];

                return (
                  <tr
                    key={borrowing.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Resource */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                        </div>

                        <p className="text-sm font-medium text-[#0A1A12]">
                          {borrowing.resource.title}
                        </p>
                      </div>
                    </td>

                    {/* Borrower */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#0A1A12]">
                        {borrowing.borrower.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {borrowing.borrower.email}
                      </p>
                    </td>

                    {/* Start Date */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(borrowing.borrowedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-medium ${
                          borrowing.status === "OVERDUE"
                            ? "text-red-500"
                            : "text-gray-600"
                        }`}
                      >
                        {new Date(borrowing.dueDate).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${
                          s?.bg ?? "bg-gray-100"
                        } ${
                          s?.text ?? "text-gray-600"
                        } text-xs font-medium rounded-full`}
                      >
                        <span
                          className={`w-1.5 h-1.5 ${
                            s?.dot ?? "bg-gray-400"
                          } rounded-full`}
                        />

                        {s?.label ?? borrowing.status}
                      </span>
                    </td>

                    {/* Menu */}
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block z-50">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === borrowing.id ? null : borrowing.id,
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500 hover:cursor-pointer" />
                        </button>

                        {openMenu === borrowing.id && (
                          <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                            <button
                              onClick={() => fetchBorrowing(borrowing.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 hover:cursor-pointer"
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
      {loadingBorrowing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

              <p className="text-sm text-gray-600">Loading borrowing...</p>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedBorrowing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-[#0A1A12]">
                  Borrowing Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  View borrowing information
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 hover:cursor-pointer" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Resource */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Resource
                </p>

                <p className="text-sm font-medium text-[#0A1A12] mt-1">
                  {selectedBorrowing.resource.title}
                </p>
              </div>

              {/* Borrower */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Borrower
                </p>

                <p className="text-sm font-medium text-[#0A1A12] mt-1">
                  {selectedBorrowing.borrower.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedBorrowing.borrower.email}
                </p>
              </div>

              {/* Borrowed At */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Borrowed At
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedBorrowing.borrowedAt).toLocaleString()}
                </p>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Due Date
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedBorrowing.dueDate).toLocaleString()}
                </p>
              </div>

              {/* Returned At */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Returned At
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {selectedBorrowing.returnedAt
                    ? new Date(selectedBorrowing.returnedAt).toLocaleString()
                    : "Not returned yet"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </p>

                <div className="mt-1">
                  {(() => {
                    const s = statusConfig[selectedBorrowing.status];

                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${
                          s?.bg ?? "bg-gray-100"
                        } ${
                          s?.text ?? "text-gray-600"
                        } text-xs font-medium rounded-full`}
                      >
                        <span
                          className={`w-1.5 h-1.5 ${
                            s?.dot ?? "bg-gray-400"
                          } rounded-full`}
                        />

                        {s?.label ?? selectedBorrowing.status}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Reservation */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Reservation
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {selectedBorrowing.reservation ? "Yes" : "No reservation"}
                </p>
              </div>

              {/* Created At */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Created At
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedBorrowing.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Updated At */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Updated At
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {new Date(selectedBorrowing.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:cursor-pointer"
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
