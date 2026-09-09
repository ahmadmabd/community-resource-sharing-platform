import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="flex items-center gap-3 mb-8">
  <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
    <ArrowLeft size={20} />
  </Link>
  <MessageCircle size={24} color="#0F4C35" />
  <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
</div>
        <div className="flex flex-col gap-3">
          {conversations.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">No conversations yet</p>
              <Link href="/dashboard" className="text-[#0F4C35] text-sm font-medium hover:underline mt-2 inline-block">
                Find people to chat with
              </Link>
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherUser = conversation.participants.find(
                (p) => p.userId !== session.user.id
              )?.user;

              const lastMessage = conversation.messages[0];

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0F4C35] flex items-center justify-center text-white font-medium shrink-0">
                    {otherUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{otherUser?.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {lastMessage ? lastMessage.content : "No messages yet"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-300 shrink-0">
                    {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : ""}
                  </p>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}