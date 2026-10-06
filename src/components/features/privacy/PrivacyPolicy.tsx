import { ShieldCheck } from "lucide-react";

import RichText from "@/src/components/common/RichText";
import { PRIVACY_PAGE as C } from "@/src/constants/privacy";

import styles from "./PrivacyPolicy.module.scss";

/** Trang /privacy. */
export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.box}>
          <div className={styles.row}>
            <ShieldCheck size={28} />
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

          {C.sections.map(({ icon: Icon, title, body, list }) => (
            <section key={title} className={styles.section}>
              <h2 className={styles.heading}>
                <Icon size={18} className={styles.box2} />
                {title}
              </h2>
              <p>
                <RichText value={body} />
              </p>
              {list && (
                <ul className={styles.list}>
                  {list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
