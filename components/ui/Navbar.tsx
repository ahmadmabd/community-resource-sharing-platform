"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Search, MessageCircle, Bell, LayoutDashboard, LogOut, User, ChevronDown, Menu, Home } from "lucide-react";

type NavbarProps = {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  } | null;
};

export default function Navbar({ session }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardHref = session?.user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-2 bg-white border-b border-[#EDECEA] sticky top-0 z-50">
      <Link href="/">
        <Image src="/images/logo.png" alt="ShareHub logo" width={100} height={32} className="object-contain" />
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-[#0F4C35] transition-colors">Home</Link>
        <Link href="/resources" className="text-sm text-gray-600 hover:text-[#0F4C35] transition-colors flex items-center gap-1">
          <Search size={13} /> Browse
        </Link>
        {session && (
          <Link href="/messages" className="text-sm text-gray-600 hover:text-[#0F4C35] transition-colors flex items-center gap-1">
            <MessageCircle size={13} /> Messages
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Link href="/notifications" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <Bell size={18} />
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0F4C35] flex items-center justify-center text-white text-xs font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">{session.user.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#EDECEA] rounded-xl shadow-lg py-1.5 z-50">
                  <Link
                    href={dashboardHref}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard size={15} className="text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/user/${session.user.email}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} className="text-gray-400" />
                    My Profile
                  </Link>
                  <div className="border-t border-[#EDECEA] my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-[#EDECEA] transition-colors">Sign in</Link>
            <Link href="/register" className="text-sm text-white bg-[#0F4C35] px-4 py-1.5 rounded-lg hover:bg-[#0D3F2C] transition-colors font-medium">Get started</Link>
          </>
        )}

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Menu"
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[#EDECEA] shadow-lg py-2 z-50">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Home size={15} className="text-gray-400" />
            Home
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Search size={15} className="text-gray-400" />
            Browse
          </Link>
          {session && (
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle size={15} className="text-gray-400" />
              Messages
            </Link>
          )}
          {session && (
            <Link
              href={dashboardHref}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard size={15} className="text-gray-400" />
              Dashboard
            </Link>
          )}
          {session && (
            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Bell size={15} className="text-gray-400" />
              Notifications
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}