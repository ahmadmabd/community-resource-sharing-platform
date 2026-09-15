import BackButton from "@/components/ui/resources/BackButton";

async function ResourceDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`http://localhost:3000/api/resources/${id}`);

  const resource = await response.json();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <BackButton />
          <h2 className="ml-3 text-lg font-semibold text-gray-800">
            Resource Details
          </h2>
        </div>

        {/* Image */}
        <div className="w-full h-64 bg-gray-100">
          <img
            src={resource.data.images[0].url}
            alt={resource.data.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-5">
            {resource.data.title}
          </h1>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Condition</span>
              <span className="font-medium text-gray-800">
                {resource.data.condition}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Category</span>
              <span className="font-medium text-gray-800">
                {resource.data.category.name}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Owner</span>
              <span className="font-medium text-gray-800">
                {resource.data.owner.name}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-800">
                {resource.data.location}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600">
                {resource.data.status}
              </span>
            </div>
          </div>

          {/* Request Button */}
          <button className="mt-6 w-full rounded-xl bg-gray-800 py-3 font-semibold text-white transition hover:bg-gray-700 hover:cursor-pointer">
            Request to Borrow
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetails;
