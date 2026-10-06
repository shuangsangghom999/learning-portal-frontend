import { AlertTriangle } from "lucide-react";

import RichText from "@/src/components/common/RichText";
import { TERMS_PAGE as C } from "@/src/constants/terms";

import styles from "./TermsOfService.module.scss";

/** Trang /terms. */
export default function TermsOfService() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.box}>
          <div className={styles.row}>
            <span className={styles.label}>{C.badge}</span>
          </div>
          <h1 className={styles.title}>{C.title}</h1>
          <p className={styles.text}>{C.updated}</p>
        </div>

        {/* Content */}
        <div className={styles.stack}>
          <p>
            <RichText value={C.intro} />
          </p>

          {C.sections.map(({ title, body }, i) => (
            <section key={title} className={styles.section}>
              <h2 className={styles.heading}>
                <span className={styles.row2}>{i + 1}</span>
                {title}
              </h2>
              <p>
                <RichText value={body} />
              </p>
            </section>
          ))}

          <section className={styles.section2}>
            <h2 className={styles.heading2}>
              <AlertTriangle size={18} />
              {C.warning.title}
            </h2>
            <p className={styles.text2}>{C.warning.body}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
