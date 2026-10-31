import { Star } from "lucide-react";

import { COURSE_LEVEL_LABELS } from "@/src/constants/course-level";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import type { Course } from "@/src/services/course";
import type { ReviewStats } from "@/src/services/review";

import styles from "../CoursePage.module.scss";

const K = C.keyInfo;

/* The 4 thong so: so bai hoc, danh gia, cap do, thoi han hoc. */
export default function CourseKeyInfo({
  course,
  stats,
}: {
  course: Course;
  stats: ReviewStats | null;
}) {
  const lessons = course.lessons?.length ?? 0;
  // stats la so dem truc tiep tu bang danh gia; course.rating/reviewsCount la
  // ban sao luu trong khoa - chi dung khi chua tai xong stats.
  const total = stats?.totalReviews ?? course.reviewsCount ?? 0;
  const average = Number(stats?.averageRating ?? course.rating ?? 0);
  const levelLabel = COURSE_LEVEL_LABELS[course.level];
  const paid = (course.price ?? 0) > 0;

  return (
    <div className={styles.keyInfo}>
      <div className={styles.keyItem}>
        {lessons > 0 ? (
          <>
            <div className={styles.keyTitle}>{K.lessons(lessons)}</div>
            <a href="#curriculum" className={`${styles.keySub} ${styles.keyLink}`}>
              {K.lessonsLink}
            </a>
          </>
        ) : (
          <>
            <div className={styles.keyTitle}>{K.noLessons}</div>
            <div className={styles.keySub}>{K.noLessonsSub}</div>
          </>
        )}
      </div>

      <div className={styles.keyItem}>
        {total > 0 ? (
          <div className={styles.keyTitle}>
            {average.toFixed(1)}
            <Star size={18} fill="currentColor" aria-hidden className={styles.keyStar} />
            <span className={styles.keyCount}>{K.reviews(total)}</span>
          </div>
        ) : (
          <>
            <div className={styles.keyTitle}>{K.noReviews}</div>
            <div className={styles.keySub}>{K.noReviewsSub(C.reviewMinProgress)}</div>
          </>
        )}
      </div>

      <div className={styles.keyItem}>
        <div className={styles.keyTitle}>
          {levelLabel ? K.level(levelLabel) : K.levelFallback}
        </div>
        <div className={styles.keySub}>
          {K.levelSub[course.level] ?? K.levelSubFallback}
        </div>
      </div>

      <div className={styles.keyItem}>
        <div className={styles.keyTitle}>
          {paid ? K.accessPaid(course.accessDays || 30) : K.accessFree}
        </div>
        <div className={styles.keySub}>{paid ? K.accessPaidSub : K.accessFreeSub}</div>
      </div>
    </div>
  );
}
