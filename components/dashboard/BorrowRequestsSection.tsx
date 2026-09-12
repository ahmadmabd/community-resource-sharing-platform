import { Check, Clock, X } from "lucide-react";

const requests = [
  {
    id: 1,
    user: "Ahmad Khalil",
    resource: "Canon Camera",
    date: "Sep 12, 2026",
    status: "Pending",
  },
  {
    id: 2,
    user: "Omar Hassan",
    resource: "MacBook Pro",
    date: "Sep 14, 2026",
    status: "Pending",
  },
  {
    id: 3,
    user: "Karim Ali",
    resource: "Power Drill",
    date: "Sep 15, 2026",
    status: "Pending",
  },
];

export default function BorrowRequestsSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Borrow Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Requests waiting for your approval.
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            {requests.length} Pending
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {requests.map((request) => (
          <div key={request.id} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{request.user}</h3>

                <p className="mt-1 text-sm text-gray-600">
                  Requested:{" "}
                  <span className="font-medium">{request.resource}</span>
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} />
                  {request.date}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Check size={15} />
                  Approve
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <X size={15} />
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
