import React from "react";

const SearchBar = () => {
  return (
    <form action="/resources" method="GET" className="mb-8 flex justify-center">
      <input
        type="text"
        name="search"
        placeholder="Search resources..."
        className="w-full max-w-xl rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
      />

      <button
        type="submit"
        className="ml-3 rounded-xl bg-[#0F4C35] px-6 py-3 font-medium text-white hover:bg-[#0D3F2C] hover:cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
