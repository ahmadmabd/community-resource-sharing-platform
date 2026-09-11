import React from "react";
import Sidebar from "@/temp-components/uia/admin/Sidebar";
import Navbar from "@/temp-components/uia/admin/Navbar";
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
