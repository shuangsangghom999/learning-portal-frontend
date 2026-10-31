import Link from "next/link";
import { BookOpen, Check, ShoppingCart } from "lucide-react";

import Avatar from "@/src/components/ui/Avatar";
import SafeImage from "@/src/components/ui/SafeImage";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { getInstructorName, type Course } from "@/src/services/course";
import { formatVnd } from "@/src/lib/format";
import { formatMoney } from "@/src/services/order";
import type { ReviewStats } from "@/src/services/review";

import type { CourseDetailState } from "../hooks/useCourseDetail";
import styles from "../CoursePage.module.scss";
import CourseKeyInfo from "./CourseKeyInfo";
import VoucherInput from "./VoucherInput";

const H = C.hero;

/**
 * Nut chinh cua trang - dung o hero va o thanh tab dinh. Da ghi danh thi vao
 * hoc; chua thi goi `onClick` (hero: ghi danh / tao don thanh toan ngay; thanh
 * dinh: khoa co phi cuon ve khu mua o hero - xem handleHeroClick).
 */
export function CourseCta({
  s,
  onClick,
  small = false,
}: {
  s: CourseDetailState;
  onClick: () => void;
  small?: boolean;
}) {
  const cls = `${styles.cta} ${small ? styles.ctaSmall : ""}`;
  if (s.isEnrolled) {
    return (
      <Link href={C.learnHref(s.courseSlug)} className={cls}>
        {H.enter}
      </Link>
    );
  }
  const price = s.course?.price ?? 0;
  const label =
    price === 0
      ? H.freeEnroll
      : s.expiredAt
        ? H.renew
        : H.buy(formatMoney(Math.max(0, price - s.soTienGiam)));
  return (
    <button type="button" onClick={onClick} disabled={s.submitting} className={cls}>
      {s.submitting ? H.processing : label}
    </button>
  );
}

export const providerOf = (course: Course) =>
  course.provider && typeof course.provider === "object" ? course.provider : null;

/** Hoa tiet vong cung sau anh bia - chi de trang tri. */
function HeroArt() {
  return (
    <div aria-hidden className={styles.artClip}>
      <svg className={styles.art} viewBox="0 0 620 520" fill="none">
        <circle
          cx="360"
          cy="290"
          r="215"
          stroke="#e3eeff"
          strokeWidth="90"
          strokeDasharray="900 2000"
          transform="rotate(130 360 290)"
        />
        <circle
          cx="360"
          cy="290"
          r="135"
          stroke="#dae1ed"
          strokeOpacity="0.55"
          strokeWidth="48"
          strokeDasharray="480 2000"
          transform="rotate(205 360 290)"
        />
        <circle
          cx="360"
          cy="290"
          r="292"
          stroke="#a7b4c9"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="320 2000"
          transform="rotate(40 360 290)"
        />
      </svg>
    </div>
  );
}

/* Hero kieu Coursera: don vi, ten khoa, giang vien, nut lon, so hoc vien; the
   4 thong so de len mep duoi. */
export default function CourseHero({
  s,
  course,
  stats,
  ctaRef,
}: {
  s: CourseDetailState;
  course: Course;
  stats: ReviewStats | null;
  /** Gan vao khu nut - CourseDetail theo doi de hien nut o thanh tab. */
  ctaRef: (node: HTMLDivElement | null) => void;
}) {
  const provider = providerOf(course);
  const instructor = getInstructorName(course.instructor) || C.instructorFallback;
  const price = course.price ?? 0;
  const buying = price > 0 && !s.isEnrolled;

  return (
    <section className={styles.heroWrap}>
      <HeroArt />
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroMain}>
            {provider && (
              <div className={styles.provider}>
                {provider.logo && (
                  <span className={styles.providerLogo}>
                    <SafeImage src={provider.logo} alt="" fill sizes="44px" />
                  </span>
                )}
                {provider.name}
              </div>
            )}

            <h1 className={styles.title}>{course.title}</h1>

            <div className={styles.instructor}>
              <Avatar ten={instructor} size={40} colorful />
              <span>
                {H.instructor} <strong>{instructor}</strong>
              </span>
            </div>

            {/* Khu mua (thay the the hoc phi cu): nut chinh, gio hang, ma giam
                gia. Nut o thanh dinh cuon ve day (id = C.buyAnchorId). */}
            <div ref={ctaRef} id={C.buyAnchorId} className={styles.ctaBlock}>
              {!s.isEnrolled && (s.expiredAt || s.error) && (
                <p className={styles.notice}>
                  {s.expiredAt ? H.expired(s.expiredAt) : s.error}
                </p>
              )}

              <div className={styles.ctaRow}>
                <CourseCta s={s} onClick={s.handleEnrollCourse} />
                {buying &&
                  (s.isInCart(course._id) ? (
                    <Link href={C.cartHref} className={styles.ctaGhost}>
                      <Check size={18} aria-hidden /> {H.inCart}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={s.addCourseToCart}
                      className={styles.ctaGhost}
                    >
                      <ShoppingCart size={18} aria-hidden /> {H.addToCart}
                    </button>
                  ))}
              </div>

              {buying && s.soTienGiam > 0 && (
                <p className={styles.discount}>
                  <s>{formatVnd(price)}</s>
                  <strong>{formatVnd(Math.max(0, price - s.soTienGiam))}</strong>
                </p>
              )}

              {/* Ma giam gia nam ngay duoi nut mua: ap ma xong roi moi bam
                  mua, khong phai bam roi moi nho ra minh co ma. */}
              {buying && (
                <VoucherInput courseId={course._id} onVoucherChange={s.changeVoucher} />
              )}

              <p className={styles.enrolled}>
                <strong>{(course.studentsCount || 0).toLocaleString("vi-VN")}</strong>{" "}
                {H.enrolled}
              </p>
              <p className={styles.access}>
                {price > 0 ? H.accessPaid(course.accessDays || 30) : H.accessFree}
              </p>
            </div>
          </div>

          <div className={styles.cover}>
            {course.thumbnail ? (
              <SafeImage
                src={course.thumbnail}
                alt={course.title}
                fill
                sizes="460px"
                priority
              />
            ) : (
              <div className={styles.coverEmpty}>
                <BookOpen size={48} aria-hidden />
              </div>
            )}
          </div>
        </div>

        <CourseKeyInfo course={course} stats={stats} />
      </div>
    </section>
  );
}
