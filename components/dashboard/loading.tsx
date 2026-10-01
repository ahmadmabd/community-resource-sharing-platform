export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Resource cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Image */}
              <div className="h-48 w-full animate-pulse bg-gray-200" />

              <div className="space-y-4 p-5">
                {/* Title */}
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                {/* Category */}
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />

                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 border-t pt-4">
                  <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
