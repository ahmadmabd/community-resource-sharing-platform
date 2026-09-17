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

const stats = [
  {
    label: "Total Users",
    value: "100",
    icon: Users,
    color: "text-[#5BB88A]",
    bg: "bg-[#5BB88A]/10",
    border: "border-l-[#5BB88A]",
    trend: "+12 this week",
  },
  {
    label: "Total Resources",
    value: "10",
    icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-l-blue-400",
    trend: "+3 this week",
  },
  {
    label: "Pending Requests",
    value: "10",
    icon: ClipboardList,
    color: "text-[#F5A623]",
    bg: "bg-[#F5A623]/10",
    border: "border-l-[#F5A623]",
    trend: "Needs attention",
  },
  {
    label: "Active Borrowings",
    value: "10",
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-l-purple-400",
    trend: "Currently active",
  },
  {
    label: "Open Reports",
    value: "10",
    icon: FileText,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-l-red-400",
    trend: "Requires review",
  },
];

const recentActivity = [
  { icon: TrendingUp, color: "text-[#5BB88A]", bg: "bg-[#5BB88A]/10", text: "User created a new resource", time: "2 min ago" },
  { icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-400/10", text: "Borrow request approved", time: "15 min ago" },
  { icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-400/10", text: "Resource returned successfully", time: "1 hr ago" },
  { icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10", text: "New report submitted", time: "3 hr ago" },
  { icon: Clock, color: "text-[#F5A623]", bg: "bg-[#F5A623]/10", text: "Borrowing overdue — user notified", time: "5 hr ago" },
];

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, <span className="font-medium text-[#0F4C35]">{session?.user.name}</span>
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
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold text-[#0A1A12] mt-1">{value}</p>
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
        <h2 className="text-sm font-semibold text-[#0A1A12] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map(({ icon: Icon, color, bg, text, time }, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className={`${bg} p-2 rounded-lg shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <p className="text-sm text-gray-700 flex-1">{text}</p>
              <span className="text-xs text-gray-400 shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}