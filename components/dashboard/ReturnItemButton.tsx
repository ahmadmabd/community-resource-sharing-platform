"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

interface Props {
  borrowingId: string;
  label?: string;
  showReviewModal?: boolean;
}

export default function ReturnItemButton({
  borrowingId,
  label = "Return",
  showReviewModal = true,
}: Props) {
  const router = useRouter();
  const [returning, setReturning] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReturn() {
    setReturning(true);
    try {
      const res = await fetch(`/api/borrowings/${borrowingId}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        toast.error("Failed to return item", successToastStyle);
        return;
      }
      toast.success("Item returned successfully!", successToastStyle);
      if (showReviewModal) {
        setShowReview(true);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setReturning(false);
    }
  }

  async function handleSubmitReview() {
    if (rating === 0) {
      toast.error("Please select a rating", successToastStyle);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowingId, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error, successToastStyle);
        return;
      }
      toast.success("Review submitted!", successToastStyle);
      setShowReview(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong", successToastStyle);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    setShowReview(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={handleReturn}
        disabled={returning}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
      >
        {returning ? "Returning..." : label}
      </button>

      {showReview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-base font-semibold text-[#0A1A12] mb-1">Rate your experience</h2>
            <p className="text-sm text-gray-500 mb-5">How was the owner? Your feedback helps the community.</p>

            <div className="flex items-center justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-[#F5A623] fill-[#F5A623]"
                        : "text-gray-300 fill-gray-100"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-sm text-gray-500 mb-4">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment (optional)..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BB88A]/30 focus:border-[#5BB88A] resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || rating === 0}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#0F4C35] rounded-xl hover:bg-[#0F4C35]/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
