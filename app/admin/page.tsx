import React from "react";
import DashboardCards from "@/temp-components/uia/admin/DashboardCards";
const Dashboard = [
  {
    id: 1,
    title: "Total Users",
    value: "100",
  },
  {
    id: 2,
    title: "Total Resources",
    value: "10",
  },
  {
    id: 3,
    title: "Pending Borrow Requests",
    value: "10",
  },
  {
    id: 4,
    title: "Active Borrowings",
    value: "10",
  },
  {
    id: 5,
    title: "Open Reports",
    value: "10",
  },
];
const activity = [
  {
    id: 1,
    title: "User created a resource",
  },
  {
    id: 2,
    title: "Borrow request approved",
  },
  {
    id: 3,
    title: "Resource returned",
  },
  {
    id: 4,
    title: "New report submitted",
  },
];
const dashboard = () => {
  return (
    <section>
      <div className="p-4 text-3xl text-black text-center mt-4">
        <h1>Admin Dashboard</h1>
        <h1>Welcome back, Ahmad</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Dashboard.map((item) => (
          <DashboardCards key={item.id} title={item.title} value={item.value} />
        ))}
      </div>
      <div className="p-4">
        <h2 className=" text-3xl text-black">Recent Activity</h2>
        <ul className="list-disc list-inside">
          {activity.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default dashboard;
