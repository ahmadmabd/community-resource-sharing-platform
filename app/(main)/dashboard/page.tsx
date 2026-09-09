import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {session.user.name}! 
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here are the members of your community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.length === 0 ? (
            <p className="text-gray-400 text-sm">No other users yet.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F4C35] flex items-center justify-center text-white font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <a href="/messages" className="text-xs bg-[#0F4C35] text-white px-3 py-1.5 rounded-lg hover:bg-[#0D3F2C] transition-colors">Chat</a>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}