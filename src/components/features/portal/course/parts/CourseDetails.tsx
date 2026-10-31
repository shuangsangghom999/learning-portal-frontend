"use client";

import { useEffect, useState } from "react";
import { Clock, FileText, PlayCircle, Star } from "lucide-react";

import Avatar from "@/src/components/ui/Avatar";
import SafeImage from "@/src/components/ui/SafeImage";
import { COURSE_LEVEL_LABELS } from "@/src/constants/course-level";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { getInstructorName, type Course } from "@/src/services/course";

import styles from "../CoursePage.module.scss";
import { sortedLessons } from "./CourseAbout";
import { providerOf } from "./CourseHero";

const D = C.details;

/** Doan gioi thieu cat con 4 dong, nut "Xem them" chi hien khi that su bi cat. */
function AboutText({ text }: { text: string }) {
  const [node, setNode] = useState<HTMLParagraphElement | null>(null);
  const [open, setOpen] = useState(false);
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    // Do khi dang thu gon: mo ra roi thi scrollHeight = clientHeight, do luc do
    // se lam nut "Thu gon" bien mat.
    if (!node || open) return;
    const ro = new ResizeObserver(() =>
      setClipped(node.scrollHeight > node.clientHeight + 1),
    );
    ro.observe(node);
    return () => ro.disconnect();
  }, [node, open]);

  return (
    <>
      <p ref={setNode} className={`${styles.description} ${open ? "" : styles.clamp}`}>
        {text}
      </p>
      {clipped && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={styles.moreButton}
        >
          {open ? D.less : D.more}
        </button>
      )}
    </>
  );
}

/* Muc "Chi tiet khoa hoc" (kieu Project details cua Coursera): gioi thieu trai
   ngang o tren; ben duoi la the "Hoc tung buoc" + trinh do (trai) va mot the
   gom giang vien + don vi cung cap (phai). */
export default function CourseDetails({ course }: { course: Course }) {
  const lessons = sortedLessons(course.lessons);
  const provider = providerOf(course);
  const instructor = getInstructorName(course.instructor) || C.instructorFallback;
  const level = COURSE_LEVEL_LABELS[course.level];
  const is = course.instructorStats;
  const ps = course.providerStats;

  return (
    <section id="curriculum" className={styles.section}>
      <div className={styles.about}>
        <h2 className={styles.h2}>{D.aboutHeading}</h2>
        <AboutText text={course.description?.trim() || D.aboutEmpty} />
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailsCard}>
          <h3 className={styles.h3}>{D.stepsHeading}</h3>
          {lessons.length > 0 ? (
            <>
              <p className={styles.h3Intro}>{D.stepsIntro(lessons.length)}</p>
              <ol className={styles.steps}>
                {lessons.map((lesson, i) => (
                  <li key={lesson._id || i}>
                    <span className={styles.stepNo}>{i + 1}</span>
                    <span aria-hidden className={styles.stepDot}>
                      •
                    </span>
                    <span className={styles.stepTitle}>{lesson.title}</span>
                    {(lesson.duration || lesson.videoUrl || lesson.documentUrl) && (
                      <span className={styles.lessonMeta}>
                        {lesson.duration && (
                          <span>
                            <Clock size={14} aria-hidden />
                            {lesson.duration}
                          </span>
                        )}
                        {lesson.videoUrl && (
                          <span>
                            <PlayCircle size={14} aria-hidden />
                            {D.video}
                          </span>
                        )}
                        {lesson.documentUrl && (
                          <span>
                            <FileText size={14} aria-hidden />
                            {D.document}
                          </span>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className={styles.empty}>{D.stepsEmpty}</p>
          )}

          <h4 className={styles.h4}>{D.levelHeading}</h4>
          <p className={styles.description}>
            {level ? C.keyInfo.level(level) : C.keyInfo.levelFallback}
            {" — "}
            {(
              C.keyInfo.levelSub[course.level] ?? C.keyInfo.levelSubFallback
            ).toLowerCase()}
            .
          </p>
        </div>

        <aside className={styles.sideCard}>
          <h3 className={styles.sideTitle}>{D.instructorHeading}</h3>
          {is?.rating != null && (
            <p className={styles.sideRating}>
              {D.instructorRating}
              <strong>
                {is.rating.toFixed(1)}
                <Star size={15} fill="currentColor" aria-hidden />
              </strong>
              <span className={styles.sideMuted}>{D.ratings(is.ratings)}</span>
            </p>
          )}
          <div className={styles.person}>
            <Avatar ten={instructor} size={56} colorful />
            <div>
              <div className={styles.personName}>{instructor}</div>
              {is && (
                <div className={styles.sideMuted}>
                  {D.courses(is.courses)}
                  <span aria-hidden> • </span>
                  {D.learners(is.learners)}
                </div>
              )}
            </div>
          </div>

          {provider && (
            <>
              <hr className={styles.sideDivider} />
              <h3 className={styles.sideTitle}>{D.providerHeading}</h3>
              <div className={styles.person}>
                {provider.logo && (
                  <span className={styles.unitLogo}>
                    <SafeImage src={provider.logo} alt="" fill sizes="56px" />
                  </span>
                )}
                <div>
                  <div className={styles.personName}>{provider.name}</div>
                  <div className={styles.sideMuted}>
                    {D.providerType[provider.type]}
                    {ps && (
                      <>
                        <span aria-hidden> • </span>
                        {D.courses(ps.courses)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
