"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import URLS from "./admin-navigation";
type NavbarProps = {
  userName: string;
};
const Navbar = ({ userName }: NavbarProps) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="container mx-auto flex items-center justify-between gap-10">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden text-gray-400 p-2 rounded-md focus:outline-none hover:text-gray-500 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="text-white font-bold text-lg">My App</div>
        <div className="space-x-4 text-white">{userName?.toUpperCase() ?? ""}</div>
      </div>
      {mobileMenuOpen && (
        <div className="flex flex-col bg-gray-800 text-white gap-2 p-2 md:hidden ">
          {URLS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "block py-2 px-4 rounded bg-blue-900 border border-transparent"
                  : "block py-2 px-4 rounded hover:bg-gray-700"
              }
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
