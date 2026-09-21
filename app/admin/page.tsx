import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import {
  Users,
  Package,
  ClipboardList,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { LucideIcon } from "lucide-react";
type Stat = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  trend: string;
};
const activityStyles: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    bg: string;
  }
> = {
  RESOURCE_CREATED: {
    icon: TrendingUp,
    color: "text-[#5BB88A]",
    bg: "bg-[#5BB88A]/10",
  },

  RESOURCE_UPDATED: {
    icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },

  RESOURCE_DELETED: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },

  BORROW_REQUEST_CREATED: {
    icon: ClipboardList,
    color: "text-[#F5A623]",
    bg: "bg-[#F5A623]/10",
  },

  BORROW_REQUEST_APPROVED: {
    icon: CheckCircle2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },

  BORROW_REQUEST_REJECTED: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },

  BORROWING_STARTED: {
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },

  RESOURCE_RETURNED: {
    icon: CheckCircle2,
    color: "text-[#5BB88A]",
    bg: "bg-[#5BB88A]/10",
  },

  REPORT_CREATED: {
    icon: FileText,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },

  REPORT_RESOLVED: {
    icon: CheckCircle2,
    color: "text-[#5BB88A]",
    bg: "bg-[#5BB88A]/10",
  },

  USER_SUSPENDED: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },

  USER_REACTIVATED: {
    icon: CheckCircle2,
    color: "text-[#5BB88A]",
    bg: "bg-[#5BB88A]/10",
  },
};

export default async function AdminDashboardPage() {
  function formatTimeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) {
      return "just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString();
  }
  const totalUsers = await prisma.user.count();

  const totalResources = await prisma.resource.count();

  const pendingRequests = await prisma.borrowRequest.count({
    where: {
      status: "PENDING",
    },
  });
  const activeBorrowings = await prisma.borrowing.count({
    where: {
      status: "ACTIVE",
    },
  });
  const openReports = await prisma.report.count({
    where: {
      status: {
        in: ["PENDING", "REVIEWING"],
      },
    },
  });

  const stats: Stat[] = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-[#5BB88A]",
      bg: "bg-[#5BB88A]/10",
      border: "border-l-[#5BB88A]",
      trend: "+12 this week",
    },
    {
      label: "Total Resources",
      value: totalResources,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-l-blue-400",
      trend: "+3 this week",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: ClipboardList,
      color: "text-[#F5A623]",
      bg: "bg-[#F5A623]/10",
      border: "border-l-[#F5A623]",
      trend: "Needs attention",
    },
    {
      label: "Active Borrowings",
      value: activeBorrowings,
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-l-purple-400",
      trend: "Currently active",
    },
    {
      label: "Open Reports",
      value: openReports,
      icon: FileText,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-l-red-400",
      trend: "Requires review",
    },
  ];
  const session = await getServerSession(authOptions);

  const activities = await prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back,{" "}
          <span className="font-medium text-[#0F4C35]">
            {session?.user.name}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border, trend }) => (
          <div
            key={label}
            className={`bg-white rounded-xl border-l-4 ${border} p-5 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-3xl font-bold text-[#0A1A12] mt-1">
                  {value}
                </p>
                <p className={`text-xs mt-2 ${color}`}>{trend}</p>
              </div>
              <div className={`${bg} p-2.5 rounded-lg`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-[#0A1A12] mb-4">
          Recent Activity
        </h2>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No recent activity.</p>
          ) : (
            activities.map((activity) => {
              const style = activityStyles[activity.action] ?? {
                icon: Clock,
                color: "text-gray-400",
                bg: "bg-gray-100",
              };

              const Icon = style.icon;

              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className={`${style.bg} p-2 rounded-lg shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                  </div>

                  <p className="text-sm text-gray-700 flex-1">
                    {activity.description}
                  </p>

                  <span className="text-xs text-gray-400 shrink-0">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
