import { BookOpen, CalendarDays, Clock3, Send } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StatsCards() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Get dashboard statistics
  const [
    resourcesCount,
    pendingRequestsCount,
    upcomingReservationsCount,
    activeBorrowingsCount,
  ] = await Promise.all([
    // 1. Resources owned by the user
    prisma.resource.count({
      where: {
        ownerId: userId,
      },
    }),

    // 2. Borrow requests created by the user and waiting for approval
    prisma.borrowRequest.count({
      where: {
        requesterId: userId,
        status: "PENDING",
      },
    }),

    // 3. Upcoming reservations
    prisma.reservation.count({
      where: {
        userId: userId,
        status: "PENDING",
        startDate: {
          gte: new Date(),
        },
      },
    }),

    // 4. Currently active borrowings
    prisma.borrowing.count({
      where: {
        borrowerId: userId,
        status: "ACTIVE",
      },
    }),
  ]);

  const stats = [
    {
      title: "My Resources",
      value: resourcesCount,
      description: "Resources you own",
      icon: BookOpen,
    },
    {
      title: "Borrow Requests",
      value: pendingRequestsCount,
      description: "Waiting for approval",
      icon: Send,
    },
    {
      title: "Reservations",
      value: upcomingReservationsCount,
      description: "Upcoming reservations",
      icon: CalendarDays,
    },
    {
      title: "Active Borrowings",
      value: activeBorrowingsCount,
      description: "Currently borrowed",
      icon: Clock3,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                <Icon size={21} className="text-gray-700" />
              </div>

              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">{stat.title}</h3>

              <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
