import { ArrowRight, BookOpen } from "lucide-react";

const resources = [
  {
    id: 1,
    name: "Canon Camera",
    category: "Electronics",
    status: "Available",
  },
  {
    id: 2,
    name: "MacBook Pro",
    category: "Computers",
    status: "Borrowed",
  },
  {
    id: 3,
    name: "Programming Book",
    category: "Books",
    status: "Available",
  },
  {
    id: 4,
    name: "Power Drill",
    category: "Tools",
    status: "Reserved",
  },
];

export default function ResourcesSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Resources</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resources you have listed for sharing.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-5 transition hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                <BookOpen size={20} className="text-gray-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">{resource.name}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {resource.category}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                resource.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : resource.status === "Borrowed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {resource.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
