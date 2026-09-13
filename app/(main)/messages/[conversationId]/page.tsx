import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ChatWindow from "@/components/chat/ChatWindow";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
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
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!conversation) {
    redirect("/messages");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.userId === session.user.id
  );

  if (!isParticipant) {
    redirect("/messages");
  }

  const otherUser = conversation.participants.find(
    (p) => p.userId !== session.user.id
  )?.user;

  const initialMessages = conversation.messages
    .slice()
    .reverse()
    .map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));

  return (
    <ChatWindow
      conversationId={conversationId}
      currentUserId={session.user.id}
      currentUserName={session.user.name ?? ""}
      otherUser={otherUser ?? { id: "", name: "Unknown", email: "" }}
      initialMessages={initialMessages}
    />
  );
}