"use client";

import { useState } from "react";

import { ADMIN_FAQS as C } from "@/src/constants/admin/faqs-page";
import { useFaqManager } from "@/src/hooks/useFaqManager";
import { faqService, type ViTriFaq } from "@/src/services/faq";

const taiTheoKhuVuc = (khuVuc: ViTriFaq) =>
  khuVuc === "taiLieu" ? faqService.getDocumentFaqs() : faqService.getHomepageFaqs();

// courseId null: day la FAQ khong gan khoa hoc
const taoTheoKhuVuc = (khuVuc: ViTriFaq, question: string, answer: string) =>
  faqService.createFaq({ courseId: null, viTri: khuVuc, question, answer });

/** FAQ theo khu vuc (Trang chu / Chia se tai lieu). */
export function useAdminFaqs() {
  const [khuVuc, setKhuVuc] = useState<ViTriFaq>("trangChu");
  const area = C.areas.find((k) => k.khoa === khuVuc);

  const manager = useFaqManager({
    scope: khuVuc,
    load: taiTheoKhuVuc,
    create: taoTheoKhuVuc,
    messages: { ...C.messages, created: C.messages.created(area?.nhan) },
  });

  return { khuVuc, setKhuVuc, area, ...manager };
}
