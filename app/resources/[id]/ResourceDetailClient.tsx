"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  MessageCircle,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

const conditionMap: Record<string, string> = {
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
};

const conditionColors: Record<string, string> = {
  LIKE_NEW: "bg-[#5BB88A]/15 text-[#0F4C35]",
  GOOD: "bg-blue-100 text-blue-700",
  FAIR: "bg-amber-100 text-amber-700",
};

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  reviewer: { id: string; name: string };
}

interface Resource {
  id: string;
  title: string;
  description: string;
  condition: string;
  status: string;
  city: string | null;
  location: string | null;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
  owner: {
    id: string;
    name: string;
    bio: string | null;
    createdAt: Date;
    _count: { resources: number };
  };
  reservations: { startDate: Date; endDate: Date }[];
  borrowings: { borrowedAt: Date; dueDate: Date }[];
}

interface Props {
  resource: Resource;
  reviews: Review[];
  avgRating: number | null;
  currentUserId: string | null;
  session: { user: { id: string; name?: string | null; email?: string | null } } | null;
}

export default function ResourceDetailClient({
  resource,
  reviews,
  avgRating,
  currentUserId,
  session,
}: Props) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [messaging, setMessaging] = useState(false);

  const isOwner = currentUserId === resource.owner.id;

  async function handleBorrowRequest() {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    if (!selectedStart || !selectedEnd) {
      toast.error("Please select dates", successToastStyle);
      return;
    }
    setRequesting(true);
    try {
      const res = await fetch("/api/borrow-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          startDate: selectedStart.toISOString(),
          endDate: selectedEnd.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Borrow request sent!", successToastStyle);
      router.push("/");
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setRequesting(false);
    }
  }

  async function handleMessage() {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    setMessaging(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: resource.owner.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error, successToastStyle);
        return;
      }
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: data.id,
          content: `Hi! I'm interested in your "${resource.title}". Is it available?`,
        }),
      });
      router.push(`/messages/${data.id}`);
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setMessaging(false);
    }
  }

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const isPast = date < today;

      const isReserved =
        resource.reservations.some((r) => {
          const s = new Date(r.startDate);
          const e = new Date(r.endDate);
          s.setHours(0, 0, 0, 0);
          e.setHours(0, 0, 0, 0);
          return date >= s && date <= e;
        }) ||
        resource.borrowings.some((b) => {
          const s = new Date(b.borrowedAt);
          const e = new Date(b.dueDate);
          s.setHours(0, 0, 0, 0);
          e.setHours(0, 0, 0, 0);
          return date >= s && date <= e;
        });

      const isStart = selectedStart && date.getTime() === selectedStart.getTime();
      const isEnd = selectedEnd && date.getTime() === selectedEnd.getTime();
      const isInRange =
        selectedStart &&
        (selectedEnd || hoverDate) &&
        date > selectedStart &&
        date < (selectedEnd || hoverDate!);
      const isToday = date.getTime() === today.getTime();

      let cellClass =
        "relative text-center text-xs py-1.5 rounded-lg transition-all ";

      if (isPast || isReserved) {
        cellClass += "text-gray-200 cursor-not-allowed ";
        if (isReserved && !isPast)
          cellClass += "bg-red-100 text-red-400 cursor-not-allowed rounded-lg ";
      } else if (isStart || isEnd) {
        cellClass += "bg-[#0F4C35] text-white font-semibold cursor-pointer ";
      } else if (isInRange) {
        cellClass += "bg-[#5BB88A]/20 text-[#0F4C35] cursor-pointer ";
      } else {
        cellClass +=
          "hover:bg-[#5BB88A]/10 text-gray-700 cursor-pointer ";
      }

      if (isToday && !isStart && !isEnd && !isReserved) {
        cellClass += "ring-1 ring-[#5BB88A] ";
      }

      cells.push(
        <button
          key={day}
          type="button"
          disabled={isPast || isReserved}
          onMouseEnter={() =>
            selectedStart && !selectedEnd && setHoverDate(date)
          }
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => {
            if (!selectedStart || (selectedStart && selectedEnd)) {
              setSelectedStart(date);
              setSelectedEnd(null);
            } else {
              if (date < selectedStart) {
                setSelectedEnd(selectedStart);
                setSelectedStart(date);
              } else {
                setSelectedEnd(date);
              }
              setHoverDate(null);
            }
          }}
          className={cellClass}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F4C35] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to resources
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-80 bg-gray-100">
                {resource.images.length > 0 ? (
                  <>
                    <img
                      src={resource.images[currentImage].url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    {resource.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImage((p) => Math.max(0, p - 1))
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImage((p) =>
                              Math.min(resource.images.length - 1, p + 1)
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {resource.images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentImage(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                                i === currentImage
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full ${
                    conditionColors[resource.condition]
                  }`}
                >
                  {conditionMap[resource.condition]}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-xl font-semibold text-[#0A1A12]">
                    {resource.title}
                  </h1>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full shrink-0">
                    {resource.category.name}
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {resource.description}
                </p>

                {resource.city && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {resource.city}
                    {resource.location && ` — ${resource.location}`}
                  </div>
                )}
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-[#0A1A12]">
                    Reviews
                  </h2>
                  {avgRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                      <span className="text-sm font-medium text-[#0A1A12]">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({reviews.length})
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0F4C35]/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-[#0F4C35]">
                          {review.reviewer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-medium text-[#0A1A12]">
                            {review.reviewer.name}
                          </p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? "text-[#F5A623] fill-[#F5A623]"
                                    : "text-gray-200 fill-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-xs text-gray-500">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href={`/users/${resource.owner.id}`}
              className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0F4C35]/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-[#0F4C35]">
                    {resource.owner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1A12]">
                    {resource.owner.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {resource.owner._count.resources} resource
                    {resource.owner._count.resources !== 1 ? "s" : ""} listed
                  </p>
                </div>
              </div>
              {resource.owner.bio && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {resource.owner.bio}
                </p>
              )}
              <p className="text-xs text-[#5BB88A] font-medium">
                View all listings →
              </p>
            </Link>

            {!isOwner && (
              <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#0A1A12]">
                  Request to Borrow
                </h3>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() - 1
                          )
                        )
                      }
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <p className="text-sm font-medium text-[#0A1A12]">
                      {calendarMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <button
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() + 1
                          )
                        )
                      }
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-1">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs text-gray-400 py-1"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
                    {renderCalendar()}
                  </div>
                </div>

                {selectedStart && (
                  <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">From</span>
                      <span className="font-medium text-[#0A1A12]">
                        {selectedStart.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">To</span>
                      <span className="font-medium text-[#0A1A12]">
                        {selectedEnd
                          ? selectedEnd.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Select end date"}
                      </span>
                    </div>
                    {selectedStart && selectedEnd && (
                      <div className="flex justify-between pt-1 border-t border-gray-200">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium text-[#0F4C35]">
                          {Math.ceil(
                            (selectedEnd.getTime() -
                              selectedStart.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1}{" "}
                          day(s)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {!selectedStart && (
                  <p className="text-xs text-gray-400 text-center">
                    Click a date to start selecting
                  </p>
                )}

                {selectedStart && !selectedEnd && (
                  <p className="text-xs text-[#5BB88A] text-center">
                    Now click an end date (or same date for 1 day)
                  </p>
                )}

                <button
                  onClick={handleBorrowRequest}
                  disabled={requesting || !selectedStart || !selectedEnd}
                  className="w-full py-2.5 bg-[#0F4C35] text-white text-sm font-medium rounded-xl hover:bg-[#0F4C35]/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {requesting ? "Sending request..." : "Send borrow request"}
                </button>

                <button
                  onClick={handleMessage}
                  disabled={messaging}
                  className="w-full py-2.5 border border-[#0F4C35] text-[#0F4C35] text-sm font-medium rounded-xl hover:bg-[#0F4C35]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  {messaging ? "Opening chat..." : "Message owner"}
                </button>
              </div>
            )}

            {isOwner && (
              <div className="bg-[#0F4C35]/5 rounded-2xl p-4">
                <p className="text-sm text-[#0F4C35] font-medium text-center">
                  This is your listing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}