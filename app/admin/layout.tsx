import React from "react";
import Sidebar from "@/components/ui/admin/Sidebar";
import Navbar from "@/components/ui/admin/Navbar";
const layout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default layout;
