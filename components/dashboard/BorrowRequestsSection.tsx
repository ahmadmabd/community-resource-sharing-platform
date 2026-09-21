import { Check, Clock, X } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BorrowRequestsSection() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  // const userId = "009dd114-8983-4b5c-b2c8-f2f81dd90290";

  const requests = await prisma.borrowRequest.findMany({
    where: {
      status: "PENDING",

      // Only requests for resources owned by the current user
      resource: {
        ownerId: userId,
      },
    },

    include: {
      requester: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },

      resource: {
        select: {
          id: true,
          title: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 5,
  });

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Borrow Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Requests waiting for your approval.
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            {requests.length} Pending
          </span>
        </div>
      </div>

      {/* Requests */}
      <div className="divide-y divide-gray-100">
        {requests.length === 0 ? (
          <div className="p-5 text-sm text-gray-500">
            You have no pending borrow requests.
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Request information */}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {request.requester.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Requested:{" "}
                    <span className="font-medium">
                      {request.resource.title}
                    </span>
                  </p>

                  <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Requested{" "}
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>

                    <span>
                      Borrow period:{" "}
                      {new Date(request.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(request.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    <Check size={15} />
                    Approve
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <X size={15} />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
