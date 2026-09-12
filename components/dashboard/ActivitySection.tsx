import {
  Activity as ActivityIcon,
  CheckCircle2,
  Clock,
  PlusCircle,
  RotateCcw,
  Send,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "borrow",
    title: "Borrowed Dell Laptop",
    description: "You borrowed a Dell Laptop from Omar Hassan.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "request",
    title: "Borrow request sent",
    description: "You requested to borrow a Canon Camera.",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "resource",
    title: "Resource added",
    description: "You added Programming Book to your resources.",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "approved",
    title: "Request approved",
    description: "Your request for DSLR Camera was approved.",
    time: "2 days ago",
  },
  {
    id: 5,
    type: "return",
    title: "Resource returned",
    description: "You returned a Power Drill.",
    time: "3 days ago",
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "borrow":
      return <ActivityIcon size={18} />;

    case "request":
      return <Send size={18} />;

    case "resource":
      return <PlusCircle size={18} />;

    case "approved":
      return <CheckCircle2 size={18} />;

    case "return":
      return <RotateCcw size={18} />;

    default:
      return <ActivityIcon size={18} />;
  }
}

export default function ActivitySection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

        <p className="mt-1 text-sm text-gray-500">
          Your latest activity on the platform.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-4 p-5 transition hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              {getActivityIcon(activity.type)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-medium text-gray-900">{activity.title}</h3>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={13} />
                  {activity.time}
                </div>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
