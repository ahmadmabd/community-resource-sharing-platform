import { BookOpen, CalendarDays, Clock3, Send } from "lucide-react";

const stats = [
  {
    title: "My Resources",
    value: "12",
    description: "Resources you own",
    icon: BookOpen,
  },
  {
    title: "Borrow Requests",
    value: "5",
    description: "Waiting for approval",
    icon: Send,
  },
  {
    title: "Reservations",
    value: "3",
    description: "Upcoming reservations",
    icon: CalendarDays,
  },
  {
    title: "Active Borrowings",
    value: "4",
    description: "Currently borrowed",
    icon: Clock3,
  },
];

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                <Icon size={21} className="text-gray-700" />
              </div>

              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">{stat.title}</h3>

              <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
