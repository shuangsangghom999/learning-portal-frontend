"use client";

import { useSearchParams } from "next/navigation";

import { ADMIN_COURSE_FAQS as C } from "@/src/constants/admin-course-faqs";
import { useFaqManager } from "@/src/hooks/useFaqManager";
import { faqService } from "@/src/services/faq";

const taiTheoKhoa = (courseId: string) => faqService.getFaqsByCourse(courseId);

// Tao moi thi gui kem courseId cua khoa dang mo
const taoTheoKhoa = (courseId: string, question: string, answer: string) =>
  faqService.createFaq({ courseId, question, answer });

/** FAQ cua khoa lay tu query string: /admin/course-faqs?courseId=... */
export function useCourseFaqs() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";

  const manager = useFaqManager({
    scope: courseId,
    load: taiTheoKhoa,
    create: taoTheoKhoa,
    enabled: Boolean(courseId),
    messages: C.messages,
  });

  return { courseId, ...manager };
}
