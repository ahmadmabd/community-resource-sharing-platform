"use client";

import { useState, useEffect } from "react";
import { Search, Package, MoreHorizontal, Eye, Trash2, X } from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    dot: string;
    text: string;
    bg: string;
  }
> = {
  AVAILABLE: {
    label: "Available",
    dot: "bg-[#5BB88A]",
    text: "text-[#0F4C35]",
    bg: "bg-[#5BB88A]/15",
  },

  BORROWED: {
    label: "Borrowed",
    dot: "bg-[#F5A623]",
    text: "text-amber-700",
    bg: "bg-[#F5A623]/15",
  },

  UNAVAILABLE: {
    label: "Unavailable",
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
};

type Resource = {
  id: string;
  title: string;
  status: string;

  owner: {
    id: string;
    name: string;
    email: string;
  };

  category: {
    id: string;
    name: string;
  };
};

type ResourceDetails = {
  id: string;
  title: string;
  status: string;
  description: string | null;
  location: string | null;

  owner: {
    id: string;
    name: string;
    email: string;
  };

  category: {
    id: string;
    name: string;
  };
};

export default function AdminResourcesPage() {
  const [search, setSearch] = useState("");

  const [resources, setResources] = useState<Resource[]>([]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [selectedResource, setSelectedResource] =
    useState<ResourceDetails | null>(null);

  const [loadingResource, setLoadingResource] = useState(false);

  const [loadingResources, setLoadingResources] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  // ==========================================
  // GET ALL RESOURCES
  // Used for the table
  // ==========================================

  async function fetchResources() {
    try {
      setLoadingResources(true);
      setError("");

      const res = await fetch("/api/admin/resources");

      if (!res.ok) {
        throw new Error("Failed to fetch resources");
      }

      const data = await res.json();

      setResources(data.data);
    } catch (error) {
      console.error(error);

      setError("Failed to load resources");
    } finally {
      setLoadingResources(false);
    }
  }

  // ==========================================
  // GET ONE RESOURCE
  // Used for View popup
  // ==========================================

  async function fetchResource(id: string) {
    try {
      setLoadingResource(true);

      setError("");

      const res = await fetch(`/api/admin/resources/${id}`);

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(
          errorData.details || errorData.error || "Failed to fetch resource",
        );
      }

      const data = await res.json();

      setSelectedResource(data.data);

      setOpenMenu(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load resource details",
      );
    } finally {
      setLoadingResource(false);
    }
  }

  // ==========================================
  // DELETE RESOURCE
  // ==========================================

  async function deleteResource(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this resource?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const res = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to delete resource",
        );
      }

      // Remove deleted resource from table
      setResources((currentResources) =>
        currentResources.filter((resource) => resource.id !== id),
      );

      // Close menu
      setOpenMenu(null);

      // If the deleted resource was open in the modal,
      // close the modal too.
      if (selectedResource?.id === id) {
        setSelectedResource(null);
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to delete resource",
      );
    }
  }

  // ==========================================
  // CLOSE VIEW MODAL
  // ==========================================

  function closeModal() {
    setSelectedResource(null);
  }

  // ==========================================
  // SEARCH
  // ==========================================

  const filtered = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.owner.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* ====================================== */}
      {/* PAGE HEADER */}
      {/* ====================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A12]">Resources</h1>

        <p className="text-gray-500 text-sm mt-1">
          {resources.length} listed resources
        </p>
      </div>

      {/* ====================================== */}
      {/* ERROR MESSAGE */}
      {/* ====================================== */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ====================================== */}
      {/* TABLE */}
      {/* ====================================== */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* SEARCH */}

        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A]"
            />
          </div>
        </div>

        {/* TABLE */}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Resource
              </th>

              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Owner
              </th>

              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Category
              </th>

              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>

              <th className="px-5 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filtered.map((resource) => {
              const s = statusConfig[resource.status] ?? {
                label: resource.status,
                dot: "bg-gray-400",
                text: "text-gray-600",
                bg: "bg-gray-100",
              };

              return (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* RESOURCE */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>

                      <p className="text-sm font-medium text-[#0A1A12]">
                        {resource.title}
                      </p>
                    </div>
                  </td>

                  {/* OWNER */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0A1A12]">
                      {resource.owner.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {resource.owner.email}
                    </p>
                  </td>

                  {/* CATEGORY */}

                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {resource.category.name}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full`}
                    >
                      <span className={`w-1.5 h-1.5 ${s.dot} rounded-full`} />

                      {s.label}
                    </span>
                  </td>

                  {/* MENU */}

                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === resource.id ? null : resource.id,
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500 hover:cursor-pointer" />
                      </button>

                      {openMenu === resource.id && (
                        <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36">
                          {/* VIEW */}

                          <button
                            onClick={() => fetchResource(resource.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 hover:cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          <div className="border-t border-gray-100 my-1" />

                          {/* REMOVE */}

                          <button
                            onClick={() => deleteResource(resource.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 hover:cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* NO RESULTS */}

        {loadingResources ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />
            <p className="text-sm text-gray-600">Loading resources...</p>
          </div>
        ) : (
          filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No resources found
            </div>
          )
        )}
      </div>
      {/* ====================================== */}
      {/* LOADING VIEW */}
      {/* ====================================== */}

      {loadingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#5BB88A]" />

              <p className="text-sm text-gray-600">Loading resource...</p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* VIEW RESOURCE MODAL */}
      {/* ====================================== */}

      {selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-[#0A1A12]">
                  Resource Details
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  View resource information
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors hover:cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-6">
              {/* RESOURCE TITLE */}

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#0A1A12]">
                    {selectedResource.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Resource ID: {selectedResource.id}
                  </p>
                </div>
              </div>

              {/* OWNER */}

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Owner
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {selectedResource.owner.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedResource.owner.email}
                </p>
              </div>

              {/* CATEGORY */}

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Category
                </p>

                <p className="text-sm text-gray-800 mt-1">
                  {selectedResource.category.name}
                </p>
              </div>

              {/* DESCRIPTION */}

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Description
                </p>

                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {selectedResource.description || "No description provided"}
                </p>
              </div>

              {/* LOCATION */}

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Location
                </p>

                <p className="text-sm text-gray-800 mt-1">
                  {selectedResource.location || "No location provided"}
                </p>
              </div>

              {/* STATUS */}

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Status
                </p>

                <div className="mt-1">
                  {(() => {
                    const s = statusConfig[selectedResource.status] ?? {
                      label: selectedResource.status,
                      dot: "bg-gray-400",
                      text: "text-gray-600",
                      bg: "bg-gray-100",
                    };

                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full`}
                      >
                        <span className={`w-1.5 h-1.5 ${s.dot} rounded-full`} />

                        {s.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end px-6 py-4 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
