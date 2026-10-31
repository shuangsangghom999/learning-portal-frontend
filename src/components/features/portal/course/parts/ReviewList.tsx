import { Star, ThumbsUp } from "lucide-react";

import Avatar from "@/src/components/ui/Avatar";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";

import type { CourseReviewsState } from "../hooks/useCourseReviews";
import styles from "../CoursePage.module.scss";

const R = C.reviews;

/* Danh sach the danh gia (kieu Coursera) + nut tai them. */
export default function ReviewList({ r }: { r: CourseReviewsState }) {
  if (r.loadingReviews) return <p className={styles.loading}>{R.loading}</p>;
  if (r.reviews.length === 0) {
    return <p className={styles.empty}>{R.emptyHint(C.reviewMinProgress)}</p>;
  }

  const total = Math.max(r.totalReviews, r.reviews.length);

  return (
    <>
      <p className={styles.showing}>{R.showing(r.reviews.length, total)}</p>

      <ul className={styles.reviewCards}>
        {r.reviews.map((review) => {
          const name = review.student?.name || R.anonymous;
          return (
            <li key={review._id} className={styles.reviewCard}>
              <div className={styles.reviewer}>
                <Avatar src={review.student?.avatar} ten={name} size={56} colorful />
                <span className={styles.reviewerName}>{name}</span>
              </div>

              <div className={styles.reviewBody}>
                <div className={styles.reviewMeta}>
                  <span
                    role="img"
                    aria-label={R.reviewAria(review.rating)}
                    className={styles.reviewStars}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        aria-hidden
                        fill={i <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                    <strong aria-hidden>{review.rating.toFixed(1)}</strong>
                  </span>
                  <span aria-hidden className={styles.reviewDot}>
                    ·
                  </span>
                  <span>
                    {R.reviewedOn(new Date(review.createdAt).toLocaleDateString("vi-VN"))}
                  </span>
                </div>

                <p className={styles.reviewText}>{review.comment}</p>

                <div className={styles.reviewActions}>
                  <button
                    type="button"
                    onClick={() => r.handleMarkHelpful(review._id)}
                    className={styles.helpful}
                  >
                    <ThumbsUp size={14} aria-hidden />
                    {R.helpful(review.helpful)}
                  </button>
                  {review.isVerifiedPurchase && (
                    <span className={styles.verified}>{R.verified}</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {r.reviews.length < total && (
        <button
          type="button"
          onClick={r.loadMore}
          disabled={r.loadingMore}
          className={styles.moreReviews}
        >
          {r.loadingMore ? R.loadingMore : R.more}
        </button>
      )}
    </>
  );
}
