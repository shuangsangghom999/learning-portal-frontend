import FeatureLinks from "@/src/components/gpa/FeatureLinks";
import GradeProfile from "@/src/components/gpa/GradeProfile";
import GradeProfileGuide from "@/src/components/gpa/GradeProfileGuide";
import { GRADE_PROFILE_PAGE as C } from "@/src/constants/gpa-tools";

import styles from "./GradeProfilePage.module.scss";

// Server component de giu metadata va de phan tieu de duoc dung san trong HTML.
// Phan tinh toan can trang thai nen tach ra client component.
export default function GradeProfilePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.container2}>
          <h1 className={styles.title}>{C.title}</h1>
          <p className={styles.title}>{C.subtitle}</p>
        </div>
      </div>

      <GradeProfile />

      <div className={styles.container3}>
        <FeatureLinks
          title={C.related.title}
          subtitle={C.related.subtitle}
          items={C.related.items}
        />

        <GradeProfileGuide />
      </div>
    </div>
  );
}
