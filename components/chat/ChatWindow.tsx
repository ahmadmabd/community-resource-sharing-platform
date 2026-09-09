"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
};

type Props = {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
  };
  initialMessages: Message[];
};

export default function ChatWindow({
  conversationId,
  currentUserId,
  currentUserName,
  otherUser,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      

      if (response.ok) {
  const message = await response.json();
  setMessages((prev) => [...prev, message]);
  setContent("");
}
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/messages" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#0F4C35] flex items-center justify-center text-white font-medium text-sm shrink-0">
          {otherUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{otherUser.name}</p>
          <p className="text-xs text-gray-400">{otherUser.email}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? "bg-[#0F4C35] text-white rounded-br-sm"
                    : "bg-white text-gray-900 border border-gray-100 rounded-bl-sm shadow-sm"
                }`}>
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-green-200" : "text-gray-400"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C35]/20 focus:border-[#0F4C35] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={isSending || !content.trim()}
            className="w-10 h-10 bg-[#0F4C35] rounded-xl flex items-center justify-center hover:bg-[#0D3F2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} color="white" />
          </button>
        </form>
      </div>

    </div>
  );
}