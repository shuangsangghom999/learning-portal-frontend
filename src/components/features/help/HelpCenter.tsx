import { HelpCircle, Mail, MessageSquare } from "lucide-react";

import { HELP_PAGE as C } from "@/src/constants/help";

import HelpFaqList from "./parts/HelpFaqList";
import styles from "./HelpCenter.module.scss";

/** Trang /help. Chi phan FAQ can trang thai (mo/dong) nen chi no la client. */
export default function HelpCenter() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Banner Tìm kiếm */}
        <div className={styles.card}>
          <div className={styles.row}>
            <HelpCircle size={48} className={styles.box} />
          </div>
          <h1 className={styles.title}>{C.title}</h1>
          <p className={styles.text}>{C.intro}</p>
        </div>

        <HelpFaqList />

        {/* Khối Liên hệ Hỗ trợ */}
        <div className={styles.grid}>
          <div className={styles.card4}>
            <div className={styles.box3}>
              <Mail size={24} />
            </div>
            <div>
              <h3 className={styles.subheading}>{C.email.title}</h3>
              <p className={styles.text2}>{C.email.text}</p>
              <a href={`mailto:${C.email.address}`} className={styles.link}>
                {C.email.address}
              </a>
            </div>
          </div>

          <div className={styles.card4}>
            <div className={styles.box4}>
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className={styles.subheading}>{C.hotline.title}</h3>
              <p className={styles.text2}>{C.hotline.text}</p>
              <span className={styles.label2}>{C.hotline.number}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
