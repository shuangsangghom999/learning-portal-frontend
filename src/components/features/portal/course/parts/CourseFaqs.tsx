"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import type { FaqItem } from "@/src/services/faq";

import styles from "../CoursePage.module.scss";

/* Muc "Cau hoi thuong gap" - CourseDetail an ca muc (va tab) khi khong co cau nao. */
export default function CourseFaqs({
  faqs,
  loadingFaqs,
}: {
  faqs: FaqItem[];
  loadingFaqs: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faqs" className={styles.section}>
      <h2 className={styles.h2}>{C.faqs.heading}</h2>

      {loadingFaqs ? (
        <p className={styles.loading}>
          <Loader2 size={16} className={styles.spin} aria-hidden />
          {C.faqs.loading}
        </p>
      ) : (
        <div className={styles.faqs}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const panelId = `faq-${i}`;
            return (
              <div key={faq._id || i} className={styles.faq}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={styles.faqButton}
                >
                  {faq.question}
                  <ChevronDown size={20} aria-hidden />
                </button>
                <div
                  id={panelId}
                  className={`${styles.faqPanel} ${isOpen ? styles.faqOpen : ""}`}
                >
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
