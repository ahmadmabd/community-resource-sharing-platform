import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/ui/admin/Sidebar";
import Navbar from "@/components/ui/admin/Navbar";
const layout = async ({ children }: LayoutProps<"/">) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <Navbar userName={session.user.name ?? ""} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default layout;
