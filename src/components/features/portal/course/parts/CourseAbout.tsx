import Link from "next/link";
import { Award, Building2, CalendarClock, Check, MonitorPlay } from "lucide-react";

import { coursesHref } from "@/src/components/features/portal/course-listing";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { topicRefs, type Course } from "@/src/services/course";
import type { Lesson } from "@/src/services/lesson.api";

import styles from "../CoursePage.module.scss";
import { providerOf } from "./CourseHero";

const A = C.about;
const D = A.details;

export const sortedLessons = (lessons: Course["lessons"]): Lesson[] =>
  typeof lessons?.[0] === "object"
    ? [...(lessons as Lesson[])].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

/* Muc "Tong quan": ban se hoc gi, chu de, thong tin can biet. Phan gioi thieu
   nam o muc "Chi tiet khoa hoc" (CourseDetails). */
export default function CourseAbout({ course }: { course: Course }) {
  const lessons = sortedLessons(course.lessons);
  const learn = lessons.slice(0, A.learnCount);
  const topics = topicRefs(course.category);
  const provider = providerOf(course);
  const updated = new Date(course.updatedAt);

  return (
    <section id="about" className={styles.section}>
      {learn.length > 0 && (
        <div className={styles.block}>
          <h2 className={styles.h2}>{A.learnHeading}</h2>
          <ul className={styles.learnList}>
            {learn.map((l) => (
              <li key={l._id}>
                <Check size={20} aria-hidden />
                {l.title}
              </li>
            ))}
          </ul>
          {lessons.length > learn.length && (
            <p className={styles.learnMore}>
              <a href="#curriculum">{A.learnMore(lessons.length - learn.length)}</a>
            </p>
          )}
        </div>
      )}

      {topics.length > 0 && (
        <div className={styles.block}>
          <h2 className={styles.h2}>{A.topicsHeading}</h2>
          <ul className={styles.chips}>
            {topics.map((t) => (
              <li key={t.slug}>
                <Link href={coursesHref({ category: t.slug })} className={styles.chip}>
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.block}>
        <h2 className={styles.h2}>{A.detailsHeading}</h2>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Award size={24} aria-hidden />
            <div>
              <div className={styles.detailTitle}>{D.certificate}</div>
              <div className={styles.detailSub}>{D.certificateSub}</div>
            </div>
          </div>

          {provider && (
            <div className={styles.detail}>
              <Building2 size={24} aria-hidden />
              <div>
                <div className={styles.detailTitle}>{provider.name}</div>
                <div className={styles.detailSub}>{D.providerSub[provider.type]}</div>
              </div>
            </div>
          )}

          <div className={styles.detail}>
            <MonitorPlay size={24} aria-hidden />
            <div>
              <div className={styles.detailTitle}>{D.online}</div>
              <div className={styles.detailSub}>{D.onlineSub}</div>
            </div>
          </div>

          {!Number.isNaN(updated.getTime()) && (
            <div className={styles.detail}>
              <CalendarClock size={24} aria-hidden />
              <div>
                <div className={styles.detailTitle}>
                  {D.updated(
                    updated.toLocaleDateString("vi-VN", {
                      month: "2-digit",
                      year: "numeric",
                    }),
                  )}
                </div>
                <div className={styles.detailSub}>{D.updatedSub}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
