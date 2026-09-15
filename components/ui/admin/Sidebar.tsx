"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Tag,
  BookOpen,
  ClipboardList,
  LogOut,
  Leaf,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/resources", label: "Resources", icon: Package },
  { href: "/admin/borrowings", label: "Borrowings", icon: BookOpen },
  {
    href: "/admin/borrow-requests",
    label: "Borrow Requests",
    icon: ClipboardList,
  },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0A1A12] flex flex-col h-full shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#5BB88A] rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-[#0A1A12]" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            ShareLebn
          </span>
        </Link>
        <p className="text-[#5BB88A]/60 text-xs mt-1.5 ml-10">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#5BB88A]/15 text-[#5BB88A]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        
        <Link
          href="/admin/settings"
          className="px-3 py-2 mb-1 rounded-lg hover:bg-white/5 transition-colors block"
        >
          <p className="text-white text-sm font-medium truncate">{user.name}</p>
          <p className="text-white/40 text-xs truncate">{user.email}</p>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
