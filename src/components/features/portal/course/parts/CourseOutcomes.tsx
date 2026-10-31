import { Award, Check } from "lucide-react";

import SafeImage from "@/src/components/ui/SafeImage";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { getInstructorName, type Course } from "@/src/services/course";

import styles from "../CoursePage.module.scss";
import { providerOf } from "./CourseHero";

const O = C.outcomes;

/* Muc "Ket qua dat duoc" (kieu Outcomes cua Coursera): mot cau tom tat, ba
   gach dau dong, ben phai la mau chung nhan dung tu chinh du lieu khoa. */
export default function CourseOutcomes({ course }: { course: Course }) {
  const lessons = course.lessons?.length ?? 0;
  const provider = providerOf(course);
  const instructor = getInstructorName(course.instructor) || C.instructorFallback;
  const by = provider ? O.byProvider(instructor, provider.name) : O.by(instructor);

  return (
    <section id="outcomes" className={styles.section}>
      <div className={styles.outcomes}>
        <div className={styles.outcomesText}>
          <h2 className={styles.outcomesHeading}>
            {lessons > 0 ? O.heading(lessons) : O.headingNoLessons}
          </h2>
          <ul className={styles.outcomesList}>
            {[by, O.progress, O.certificate].map((item) => (
              <li key={item}>
                <Check size={20} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Mau chung nhan: ten khoa, giang vien, don vi la that; so chung
            nhan va ma tra cuu chi cap khi hoc xong nen o day de an. */}
        <figure className={styles.cert}>
          <div className={styles.certCard}>
            <div className={styles.certTop}>
              {provider?.logo ? (
                <span className={styles.certLogo}>
                  <SafeImage src={provider.logo} alt="" fill sizes="36px" />
                </span>
              ) : (
                <Award size={28} aria-hidden className={styles.certIcon} />
              )}
              <span className={styles.certKind}>{O.certKind}</span>
            </div>
            <div className={styles.certName}>{O.certName}</div>
            <div className={styles.certCourse}>{course.title}</div>
            <div className={styles.certFoot}>
              <span>{instructor}</span>
              <span className={styles.certCode}>{O.certCode}</span>
            </div>
          </div>
          <figcaption className={styles.certCaption}>{O.certCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
