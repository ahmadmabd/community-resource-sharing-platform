import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ResourcesSection from "@/components/dashboard/ResourcesSection";
import BorrowRequestsSection from "@/components/dashboard/IncomingBorrowRequests";
import ReservationsSection from "@/components/dashboard/ReservationsSection";
import BorrowingsSection from "@/components/dashboard/BorrowingsSection";
import ActivitySection from "@/components/dashboard/ActivitySection";
import { prisma } from "@/lib/prisma";
import MyBorrowRequests from "@/components/dashboard/MyBorrowRequests";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      imageUrl: true,
      phone: true,
      location: true,
    },
  });

  if (!user) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader
          userName={user.name ?? ""}
          userId={user.id ?? ""}
          userBio={user.bio ?? ""}
          userImage={user.imageUrl ?? ""}
          userPhone={user.phone ?? ""}
          userLocation={user.location ?? ""}
        />

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <ResourcesSection />
          <BorrowRequestsSection />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ReservationsSection />
          <BorrowingsSection />
        </div>
        <div className="grid gap-6 lg:grid-cols-1">
          <MyBorrowRequests />
        </div>

        <ActivitySection />
      </div>
    </main>
  );
}
