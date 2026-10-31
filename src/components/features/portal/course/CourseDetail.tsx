"use client";

import { Suspense, useEffect, useState } from "react";

import Breadcrumbs from "@/src/components/common/Breadcrumbs";
import CourseSuggestions from "@/src/components/common/CourseSuggestions";
import { coursesHref } from "@/src/components/features/portal/course-listing";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { firstTopic } from "@/src/services/course";

import { useCourseDetail } from "./hooks/useCourseDetail";
import { useCourseFaqs } from "./hooks/useCourseFaqs";
import { useCourseReviews } from "./hooks/useCourseReviews";
import CourseAbout from "./parts/CourseAbout";
import CourseDetails from "./parts/CourseDetails";
import CourseDetailSkeleton from "./parts/CourseDetailSkeleton";
import CourseFaqs from "./parts/CourseFaqs";
import CourseHero, { CourseCta, providerOf } from "./parts/CourseHero";
import CourseNotFound from "./parts/CourseNotFound";
import CourseOutcomes from "./parts/CourseOutcomes";
import CoursePartnersBanner from "./parts/CoursePartnersBanner";
import CourseReviews from "./parts/CourseReviews";
import CourseSubNav from "./parts/CourseSubNav";
import page from "./CoursePage.module.scss";
import styles from "./CourseDetail.module.scss";

/** true khi `node` con nam trong man hinh (tru phan header co dinh). */
function useOnScreen(node: HTMLElement | null) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!node) return;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: `-${header}px 0px 0px 0px`,
    });
    io.observe(node);
    return () => io.disconnect();
  }, [node]);
  return visible;
}

function CourseDetailContent() {
  const s = useCourseDetail();
  const { course, router } = s;
  const r = useCourseReviews(course?._id);
  const f = useCourseFaqs(course?._id);
  // Nut o hero cuon khuat thi thanh tab hien them ten khoa + nut (nhu Coursera).
  const [heroCta, setHeroCta] = useState<HTMLDivElement | null>(null);
  const heroCtaVisible = useOnScreen(heroCta);

  if (s.loading || s.jumpingToLearn) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return <CourseNotFound error={s.error} onHome={() => router.push(C.homeHref)} />;
  }

  // Trang chu > Khoa hoc > Danh muc - nhu Coursera, dung o danh muc chu
  // khong lap lai ten khoa (da la tieu de ngay ben duoi).
  const B = C.breadcrumb;
  const topic = firstTopic(course.category);
  const crumbs = [
    { label: B.courses, href: B.coursesHref },
    ...(topic
      ? [{ label: topic.name, href: coursesHref({ category: topic.slug }) }]
      : []),
  ];

  // Khong co cau hoi nao thi bo ca tab lan muc FAQ.
  const hasFaqs = f.loadingFaqs || f.faqs.length > 0;
  const tabs = C.tabs.filter((t) => t.id !== "faqs" || hasFaqs);

  return (
    <div className={page.page}>
      <Breadcrumbs
        items={crumbs}
        homeHref={C.homeHref}
        homeLabel={B.home}
        label={B.label}
      />

      <CourseHero s={s} course={course} stats={r.stats} ctaRef={setHeroCta} />

      <CourseSubNav
        tabs={tabs}
        compact={!heroCtaVisible}
        title={course.title}
        logo={providerOf(course)?.logo}
        cta={<CourseCta s={s} onClick={s.handleHeroClick} small />}
      />

      <div className={page.container}>
        <div className={page.main}>
          <CourseAbout course={course} />
          <CoursePartnersBanner />
          <CourseOutcomes course={course} />
          <CourseDetails course={course} />
          {hasFaqs && <CourseFaqs faqs={f.faqs} loadingFaqs={f.loadingFaqs} />}
          <CourseReviews r={r} isEnrolled={s.isEnrolled} userProgress={s.userProgress} />
        </div>
      </div>

      {/* Khoa lien quan, dat SAU phan danh gia - tuc la sau khi nguoi doc da
          xem het thong tin ve khoa nay. Component tu an khi khong co goi y. */}
      <CourseSuggestions soLuong={C.suggestionsCount} courseId={course._id} />
    </div>
  );
}

// Suspense la bat buoc: useSearchParams() khong the prerender tinh neu thieu boundary.
// Co boundary thi Next dung san khung HTML, Vercel phuc vu tu CDN, khong ton serverless.
export default function CourseDetail() {
  return (
    <Suspense
      fallback={
        <div className={styles.page4}>
          <div className={styles.spinner2} />
        </div>
      }
    >
      <CourseDetailContent />
    </Suspense>
  );
}
