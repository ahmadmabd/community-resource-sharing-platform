import React from "react";

const DashboardCards = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="bg-white p-4 h-56 rounded-2xl shadow flex flex-col items-center justify-center gap-5 border-gray-800">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DashboardCards;
