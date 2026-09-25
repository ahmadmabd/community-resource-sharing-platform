"use client";

import { useEffect, useState } from "react";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

type BorrowRequest = {
  id: string;
  message: string | null;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  createdAt: string;

  requester: {
    id: string;
    name: string;
    imageUrl: string | null;
  };

  resource: {
    id: string;
    title: string;
    category: {
      id: string;
      name: string;
    };
    images: {
      id: string;
      url: string;
    }[];
  };

  reservation: {
    id: string;
    status: string;
  } | null;
};

export default function IncomingBorrowRequests() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    action: "APPROVE" | "REJECT";
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRequests() {
      try {
        const response = await fetch("/api/borrow-requests/received");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load requests");
        }

        if (!cancelled) {
          setRequests(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load requests",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleResponse(
    requestId: string,
    action: "APPROVE" | "REJECT",
  ) {
    try {
      setProcessingId(requestId);
      setError("");

      const response = await fetch(`/api/borrow-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      // Remove the processed request from the Borrow Requests section
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to process request",
      );
    } finally {
      setProcessingId(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-56 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-200" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Borrow Requests</h2>

        <p className="mt-1 text-sm text-gray-500">
          People requesting to borrow your resources.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="font-medium text-gray-700">No borrow requests</p>

          <p className="mt-1 text-sm text-gray-500">
            Requests for your resources will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-2">
          {requests.map((request) => {
            return (
              <div
                key={request.id}
                className="grid overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="p-5">
                  {/* Resource */}
                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Resource
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      {request.resource.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {request.resource.category?.name || "Uncategorized"}
                    </p>
                  </div>

                  {/* Requester */}
                  <div className="mb-4 flex items-center gap-3">
                    {request.requester.imageUrl ? (
                      <img
                        src={request.requester.imageUrl}
                        alt={request.requester.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                        {request.requester.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500">Requested by</p>

                      <p className="font-medium text-gray-900">
                        {request.requester.name}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Start</span>

                      <span className="font-medium text-gray-900">
                        {formatDate(request.startDate)}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">End</span>

                      <span className="font-medium text-gray-900">
                        {formatDate(request.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500">
                        Message
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {request.message}
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* Actions */}
                  {request.status === "PENDING" && (
                    <div className="flex gap-3 border-t pt-4">
                      <button
                        type="button"
                        disabled={processingId === request.id}
                        onClick={() =>
                          setConfirmModal({ id: request.id, action: "APPROVE" })
                        }
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === request.id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={processingId === request.id}
                        onClick={() =>
                          setConfirmModal({ id: request.id, action: "REJECT" })
                        }
                        className="flex-1 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {request.status === "APPROVED" && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      Approved — reservation confirmed.
                    </div>
                  )}

                  {request.status === "REJECTED" && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      This request was declined.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-[#0A1A12] mb-2">
              {confirmModal.action === "APPROVE"
                ? "Approve request?"
                : "Decline request?"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {confirmModal.action === "APPROVE"
                ? "This will confirm the reservation and notify the borrower."
                : "The borrower will be notified that their request was declined."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleResponse(confirmModal.id, confirmModal.action);
                  setConfirmModal(null);
                }}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors cursor-pointer ${
                  confirmModal.action === "APPROVE"
                    ? "bg-[#0F4C35] hover:bg-[#0F4C35]/90"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmModal.action === "APPROVE" ? "Approve" : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
