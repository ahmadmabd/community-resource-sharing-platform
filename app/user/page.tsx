import ProfileStats from "@/components/user/ProfileStats";
import ProfileResources from "@/components/user/ProfileResources";

export default function UserPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your profile information and resources.
          </p>
        </div>

        <ProfileStats />
        <ProfileResources />
      </div>
    </main>
  );
}
