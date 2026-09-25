"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

type BorrowRequest = {
  id: string;
  message: string | null;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;

  resource: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    city: string | null;

    category: {
      id: string;
      name: string;
    };

    owner: {
      id: string;
      name: string;
      imageUrl: string | null;
    };

    images: {
      id: string;
      url: string;
    }[];
  };
};

export default function MyBorrowRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function handleCancel(requestId: string) {
    setCancelling(requestId);
    try {
      const res = await fetch(`/api/borrow-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" }),
      });
      if (!res.ok) {
        toast.error("Failed to cancel request", successToastStyle);
        return;
      }
      toast.success("Request cancelled", successToastStyle);
      router.refresh();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setCancelling(null);
    }
  }

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await fetch("/api/borrow-requests");

        if (!response.ok) {
          throw new Error("Failed to load borrow requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  if (loading) {
    return (
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">My Borrow Requests</h2>

        <p className="text-gray-500">Loading requests...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          My Borrow Requests
        </h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
          {requests.length} requests
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">
            You haven't requested to borrow any resources yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
            >
              {/* Resource information */}
              <div className="flex gap-4">
                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {request.resource.images?.[0]?.url ? (
                    <img
                      src={request.resource.images[0].url}
                      alt={request.resource.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {request.resource.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {request.resource.category.name}
                  </p>

                  {request.resource.owner && (
                    <p className="mt-1 text-sm text-gray-500">
                      Owner: {request.resource.owner.name}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(request.startDate).toLocaleDateString()} →{" "}
                    {new Date(request.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    request.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : request.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : request.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {request.status}
                </span>

                {request.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(request.id)}
                    disabled={cancelling === request.id}
                    className="text-xs text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {cancelling === request.id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
