import { Bell, Search } from "lucide-react";

type DashboardHeaderProps = {
  userName: string;
};

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side */}
      <div>
        <p className="text-sm font-medium text-gray-500">Welcome back, {userName}</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your resources, requests, reservations, and activity.
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-56 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <Bell size={19} />

          {/* Notification indicator */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Avatar */}
        <button
          type="button"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {userName.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}
