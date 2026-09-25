import { ArrowRight, BookOpen, CalendarClock } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReturnItemButton from "./ReturnItemButton";

export default async function BorrowingsSection() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const borrowings = await prisma.borrowing.findMany({
    where: {
      borrowerId: userId,
      status: "ACTIVE",
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
      dueDate: "asc",
    },
    take: 4,
  });

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Current Borrowings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Resources you currently have borrowed.
          </p>
        </div>
      </div>

      {/* Borrowings */}
      <div className="divide-y divide-gray-100">
        {borrowings.length === 0 ? (
          <div className="p-5 text-sm text-gray-500">
            You currently have no active borrowings.
          </div>
        ) : (
          borrowings.map((borrowing) => {
            const today = new Date();

            const dueDate = new Date(borrowing.dueDate);

            const differenceInMs = dueDate.getTime() - today.getTime();

            const daysLeft = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

            const isOverdue = daysLeft < 0;

            return (
              <div
                key={borrowing.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Resource */}
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                    <BookOpen size={20} className="text-gray-600" />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {borrowing.resource.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Borrowed from {borrowing.resource.owner.name}
                    </p>
                  </div>
                </div>

                {/* Due date + Return */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={`flex items-center justify-end gap-1 text-sm font-medium ${
                        isOverdue ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      <CalendarClock size={15} />

                      {dueDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    <p
                      className={`mt-1 text-xs ${
                        isOverdue ? "font-medium text-red-600" : "text-gray-500"
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(daysLeft)} days overdue`
                        : daysLeft === 0
                          ? "Due today"
                          : `${daysLeft} days left`}
                    </p>
                  </div>

                  <ReturnItemButton borrowingId={borrowing.id} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
