import Link from "next/link";

import {
  LESSON_CREATE as C,
  LESSON_CREATE_ROLE,
  type LessonCreateRole,
} from "@/src/constants/shared/lesson-create-page";

import styles from "../LessonCreate.module.scss";

interface LessonCreateActionsProps {
  role: LessonCreateRole;
  courseId: string;
  submitting: boolean;
  /** % tai video; null = khong dang tai. */
  tienDo: number | null;
}

export default function LessonCreateActions({
  role,
  courseId,
  submitting,
  tienDo,
}: LessonCreateActionsProps) {
  return (
    <div className={styles.row2}>
      <Link href={LESSON_CREATE_ROLE[role].lessonsHref(courseId)} className={styles.box5}>
        {C.actions.cancel}
      </Link>
      <button type="submit" disabled={submitting} className={styles.button2}>
        {tienDo !== null
          ? C.actions.uploading(tienDo)
          : submitting
            ? C.actions.submitting
            : C.actions.submit}
      </button>
    </div>
  );
}
