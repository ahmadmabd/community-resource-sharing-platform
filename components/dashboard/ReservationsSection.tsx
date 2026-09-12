import { ArrowRight, CalendarDays } from "lucide-react";

const reservations = [
  {
    id: 1,
    resource: "Canon Camera",
    owner: "Zakaria Hammoud",
    date: "Sep 14, 2026",
    time: "10:00 AM - 2:00 PM",
    status: "Confirmed",
  },
  {
    id: 2,
    resource: "Meeting Room",
    owner: "Community Center",
    date: "Sep 16, 2026",
    time: "2:00 PM - 4:00 PM",
    status: "Confirmed",
  },
  {
    id: 3,
    resource: "MacBook Pro",
    owner: "Ahmad Khalil",
    date: "Sep 18, 2026",
    time: "9:00 AM - 12:00 PM",
    status: "Pending",
  },
];

export default function ReservationsSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reservations</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your upcoming resource reservations.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                <CalendarDays size={20} className="text-gray-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  {reservation.resource}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {reservation.date} · {reservation.time}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Owner: {reservation.owner}
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                reservation.status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {reservation.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
