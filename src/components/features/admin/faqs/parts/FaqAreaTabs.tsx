import { ADMIN_FAQS as C } from "@/src/constants/admin-faqs";
import type { ViTriFaq } from "@/src/services/faq";

import styles from "../AdminFaqs.module.scss";

interface FaqAreaTabsProps {
  khuVuc: ViTriFaq;
  moTa: string | undefined;
  onChange: (k: ViTriFaq) => void;
}

/** Chon khu vuc: moi khu vuc mot bo FAQ rieng. */
export default function FaqAreaTabs({ khuVuc, moTa, onChange }: FaqAreaTabsProps) {
  return (
    <div className={styles.khuVuc} role="tablist" aria-label={C.areasAria}>
      {C.areas.map((k) => (
        <button
          key={k.khoa}
          type="button"
          role="tab"
          aria-selected={khuVuc === k.khoa}
          onClick={() => onChange(k.khoa)}
          className={`${styles.tabKhuVuc} ${khuVuc === k.khoa ? styles.tabKhuVucOn : ""}`}
        >
          {k.nhan}
        </button>
      ))}
      <span className={styles.moTaKhuVuc}>{moTa}</span>
    </div>
  );
}
