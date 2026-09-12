"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import URLS from "./admin-navigation";
const Sidebar = () => {
  const pathname = usePathname();
  return (
    <section className="hidden md:flex flex-col w-64 min-h-screen bg-gray-800 text-white p-7 gap-5 ">
      <div>
        <h1>Admin logo</h1>
      </div>
      <div className="flex flex-col gap-2 mt-10">
        {URLS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? "block py-2 px-4 rounded bg-blue-900"
                : "block py-2 px-4 rounded hover:bg-gray-700"
            }
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-auto">
        <span className="block py-2 px-4 rounded hover:bg-gray-700 cursor-pointer">
          Admin User
        </span>
        <span className="block py-2 px-4 rounded hover:bg-gray-700 cursor-pointer">
          Settings
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
