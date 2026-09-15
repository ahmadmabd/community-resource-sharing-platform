"use client";
import Link from "next/link";
import { useState } from "react";

type Props = {
  title: string;
  imageUrl?: string;
  condition: string;
  location: string;
  status: string;
  id: string;
};

const ResourceCard = ({
  title,
  imageUrl,
  condition,
  location,
  status,
  id,
}: Props) => {
  return (
    <div
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      id={`resource-${id}`}
    >
      {/* Image */}
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Title */}
        <h2 className="truncate text-xl font-bold text-gray-900">{title}</h2>

        {/* Location */}
        <p className="text-sm text-gray-500">📍 {location}</p>

        {/* Condition + Status */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {condition}
          </span>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {status}
          </span>
        </div>

        {/* Details */}
        <Link
          href={`/resources/${id}`}
          className="mt-2 w-full rounded-xl bg-[#0F4C35] py-3 text-center font-medium text-white transition hover:bg-[#0D3F2C] hover:cursor-pointer"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
