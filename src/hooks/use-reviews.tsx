"use client";
import * as React from "react";
import type { Review } from "@/lib/types";

interface ReviewsContextValue {
  myReviews: Review[];
  reviewedBookingIds: Set<string>;
  addReview: (review: Review, bookingId: string) => void;
  reviewsFor: (professionalId: string) => Review[];
}

const ReviewsContext = React.createContext<ReviewsContextValue | null>(null);
const REVIEWS_KEY = "sessio:my-reviews";
const REVIEWED_BOOKINGS_KEY = "sessio:reviewed-bookings";

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [myReviews, setMyReviews] = React.useState<Review[]>([]);
  const [reviewedBookingIds, setReviewedBookingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    try {
      const rawReviews = window.localStorage.getItem(REVIEWS_KEY);
      if (rawReviews) setMyReviews(JSON.parse(rawReviews));
      const rawBookings = window.localStorage.getItem(REVIEWED_BOOKINGS_KEY);
      if (rawBookings) setReviewedBookingIds(new Set(JSON.parse(rawBookings)));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const addReview = React.useCallback((review: Review, bookingId: string) => {
    setMyReviews((prev) => {
      const next = [review, ...prev];
      try {
        window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
      } catch {
        // ignore quota / privacy-mode errors
      }
      return next;
    });
    setReviewedBookingIds((prev) => {
      const next = new Set(prev).add(bookingId);
      try {
        window.localStorage.setItem(REVIEWED_BOOKINGS_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const reviewsFor = React.useCallback((professionalId: string) => myReviews.filter((r) => r.professionalId === professionalId), [myReviews]);

  return (
    <ReviewsContext.Provider value={{ myReviews, reviewedBookingIds, addReview, reviewsFor }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = React.useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
