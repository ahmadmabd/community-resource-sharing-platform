import {
  Activity as ActivityIcon,
  CheckCircle2,
  Clock,
  PlusCircle,
  RotateCcw,
  Send,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getActivityIcon(action: string) {
  switch (action.toLowerCase()) {
    case "borrow":
    case "borrowing":
      return <ActivityIcon size={18} />;

    case "request":
    case "borrow_request":
      return <Send size={18} />;

    case "resource":
    case "resource_added":
      return <PlusCircle size={18} />;

    case "approved":
    case "approve":
    case "request_approved":
      return <CheckCircle2 size={18} />;

    case "return":
    case "returned":
      return <RotateCcw size={18} />;

    default:
      return <ActivityIcon size={18} />;
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ActivitySection() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const activities = await prisma.activity.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

        <p className="mt-1 text-sm text-gray-500">
          Your latest activity on the platform.
        </p>
      </div>

      {/* Activities */}
      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="p-5 text-sm text-gray-500">No recent activity.</div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 p-5 transition hover:bg-gray-50"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                {getActivityIcon(activity.action)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-medium text-gray-900">
                    {activity.action}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={13} />
                    {formatRelativeTime(activity.createdAt)}
                  </div>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {activity.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
