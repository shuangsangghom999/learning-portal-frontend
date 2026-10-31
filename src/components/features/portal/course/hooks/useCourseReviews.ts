"use client";

import { useCallback, useEffect, useState } from "react";

import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { getErrorMessage } from "@/src/services/apiHelper";
import { reviewService, type Review, type ReviewStats } from "@/src/services/review";

/**
 * Danh gia + thong ke sao cua mot khoa, bam "huu ich" va gui danh gia moi.
 * Tai tung trang C.reviewsQuery.limit danh gia; loadMore() noi trang sau vao.
 */
export function useCourseReviews(courseId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const loadReviewsAndStats = useCallback(async (id: string) => {
    try {
      setLoadingReviews(true);
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getCourseReviews(id, C.reviewsQuery),
        reviewService.getReviewStats(id),
      ]);
      setReviews(reviewsData.reviews || []);
      setTotalReviews(reviewsData.totalReviews ?? 0);
      setPage(1);
      setStats(statsData);
    } catch (err) {
      console.error("Không thể tải dữ liệu đánh giá:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  // Tai ngay khi biet id khoa hoc. Goi qua mot vong microtask de setState
  // khong nam dong bo trong than effect (rule react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!courseId) return;
    void Promise.resolve().then(() => loadReviewsAndStats(courseId));
  }, [courseId, loadReviewsAndStats]);

  const loadMore = async () => {
    if (!courseId || loadingMore) return;
    try {
      setLoadingMore(true);
      const next = await reviewService.getCourseReviews(courseId, {
        ...C.reviewsQuery,
        page: page + 1,
      });
      // Loc trung theo _id: co nguoi vua viet danh gia moi thi trang sau bi
      // lui mot dong, dong cuoi trang truoc se lap lai.
      setReviews((prev) => {
        const seen = new Set(prev.map((r) => r._id));
        return [...prev, ...(next.reviews || []).filter((r) => !seen.has(r._id))];
      });
      setTotalReviews(next.totalReviews ?? totalReviews);
      setPage(page + 1);
    } catch (err) {
      console.error("Không thể tải thêm đánh giá:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const updatedReview = await reviewService.markHelpful(reviewId);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? { ...r, helpful: updatedReview.helpful } : r,
        ),
      );
    } catch (err) {
      alert(getErrorMessage(err, C.messages.genericError));
    }
  };

  const submitReview = async () => {
    if (!courseId) return;
    if (!newComment.trim()) return alert(C.messages.emptyReview);
    try {
      setIsSubmittingReview(true);
      await reviewService.createReview({
        courseId,
        rating: newRating,
        comment: newComment,
      });
      setNewComment("");
      loadReviewsAndStats(courseId);
      alert(C.messages.reviewSent);
    } catch (err) {
      alert(getErrorMessage(err, C.messages.reviewFailed));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return {
    reviews,
    stats,
    loadingReviews,
    totalReviews,
    loadingMore,
    loadMore,
    newRating,
    setNewRating,
    newComment,
    setNewComment,
    isSubmittingReview,
    handleMarkHelpful,
    submitReview,
  };
}

export type CourseReviewsState = ReturnType<typeof useCourseReviews>;
