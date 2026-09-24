import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReservationsSection() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  // const userId = "009dd114-8983-4b5c-b2c8-f2f81dd90290";

  const reservations = await prisma.reservation.findMany({
    where: {
      userId,
      startDate: {
        gte: new Date(),
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    include: {
      resource: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 4,
  });

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reservations</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your upcoming resource reservations.
          </p>
        </div>
      </div>

      {/* Reservations */}
      <div className="divide-y divide-gray-100">
        {reservations.length === 0 ? (
          <div className="p-5 text-sm text-gray-500">
            You have no upcoming reservations.
          </div>
        ) : (
          reservations.map((reservation) => {
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);

            const date = startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const startTime = startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            const endTime = endDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            const status =
              reservation.status.charAt(0) +
              reservation.status.slice(1).toLowerCase();

            return (
              <div
                key={reservation.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Reservation information */}
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                    <CalendarDays size={20} className="text-gray-600" />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {reservation.resource.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {date} · {startTime} - {endTime}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Owner: {reservation.resource.owner.name}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    reservation.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
