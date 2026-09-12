import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ResourcesSection from "@/components/dashboard/ResourcesSection";
import BorrowRequestsSection from "@/components/dashboard/BorrowRequestsSection";
import ReservationsSection from "@/components/dashboard/ReservationsSection";
import BorrowingsSection from "@/components/dashboard/BorrowingsSection";
import ActivitySection from "@/components/dashboard/ActivitySection";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader />

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <ResourcesSection />
          <BorrowRequestsSection />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ReservationsSection />
          <BorrowingsSection />
        </div>

        <ActivitySection />
      </div>
    </main>
  );
}
