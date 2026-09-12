import { ArrowRight, BookOpen, CalendarClock } from "lucide-react";

const borrowings = [
  {
    id: 1,
    resource: "Dell Laptop",
    owner: "Omar Hassan",
    dueDate: "Sep 13, 2026",
    daysLeft: 2,
    status: "Active",
  },
  {
    id: 2,
    resource: "DSLR Camera",
    owner: "Ahmad Khalil",
    dueDate: "Sep 17, 2026",
    daysLeft: 6,
    status: "Active",
  },
  {
    id: 3,
    resource: "React Programming Book",
    owner: "Karim Ali",
    dueDate: "Sep 20, 2026",
    daysLeft: 9,
    status: "Active",
  },
];

export default function BorrowingsSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Current Borrowings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Resources you currently have borrowed.
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
        {borrowings.map((borrowing) => (
          <div
            key={borrowing.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                <BookOpen size={20} className="text-gray-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  {borrowing.resource}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Borrowed from {borrowing.owner}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm font-medium text-gray-900">
                  <CalendarClock size={15} />
                  {borrowing.dueDate}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {borrowing.daysLeft} days left
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Return
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
