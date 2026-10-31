import { Star } from "lucide-react";

import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";

import type { CourseReviewsState } from "../hooks/useCourseReviews";
import page from "../CoursePage.module.scss";
import styles from "../CourseDetail.module.scss";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const R = C.reviews;

/** "75.43%" - giu toi da 2 so le, bo so 0 thua (50% chu khong 50.00%). */
const percent = (count: number, total: number) =>
  `${total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0}%`;

/* Muc "Danh gia" kieu Coursera: ben trai diem + phan bo sao, ben phai form
   (khi du tien do) va danh sach the danh gia. */
export default function CourseReviews({
  r,
  isEnrolled,
  userProgress,
}: {
  r: CourseReviewsState;
  isEnrolled: boolean;
  userProgress: number;
}) {
  const total = r.stats?.totalReviews ?? 0;
  const average = Number(r.stats?.averageRating ?? 0);
  const dist = r.stats?.ratingDistribution;

  return (
    <section id="reviews" className={page.section}>
      <div className={page.reviews}>
        <div className={page.reviewsSummary}>
          <h2 className={page.h2}>{R.heading}</h2>

          {total > 0 ? (
            <div role="img" aria-label={R.ratedAria(average, total)}>
              <div className={page.reviewsScore} aria-hidden>
                <Star size={22} fill="currentColor" />
                {average.toFixed(1)}
              </div>
              <div className={page.reviewsCount} aria-hidden>
                {R.count(total)}
              </div>
            </div>
          ) : (
            <div className={page.reviewsCount}>{R.noReviews}</div>
          )}

          <ul className={page.bars}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist?.[String(star) as keyof typeof dist] ?? 0;
              const p = percent(count, total);
              return (
                <li key={star}>
                  <span className={page.barLabel}>{R.stars(star)}</span>
                  <span className={page.barTrack}>
                    <span className={page.barFill} style={{ width: p }} />
                  </span>
                  <span className={page.barValue}>{p}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={page.reviewsMain}>
          {isEnrolled && userProgress >= C.reviewMinProgress ? (
            <ReviewForm r={r} userProgress={userProgress} />
          ) : isEnrolled ? (
            <div className={styles.card9}>
              <p className={styles.text10}>
                {R.locked.a}
                <strong className={styles.strong2}>
                  {R.locked.strong(C.reviewMinProgress)}
                </strong>
                {R.locked.b}
              </p>
              <p className={styles.text11}>{R.currentProgress(userProgress)}</p>
            </div>
          ) : null}

          <ReviewList r={r} />
        </div>
      </div>
    </section>
  );
}
