"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { HELP_PAGE as C } from "@/src/constants/help";

import styles from "../HelpCenter.module.scss";

/* Khối FAQs - mo mot cau mot luc */
export default function HelpFaqList() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={styles.card2}>
      <h2 className={styles.heading}>{C.faqHeading}</h2>
      <div className={styles.stack}>
        {C.faqs.map((faq, index) => (
          <div key={index} className={styles.card3}>
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className={styles.button}
            >
              <span className={styles.label}>{faq.q}</span>
              {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openFaq === index && <div className={styles.box2}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
