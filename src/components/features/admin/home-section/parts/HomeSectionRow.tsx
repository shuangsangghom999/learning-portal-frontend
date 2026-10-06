import SafeImage from "@/src/components/ui/SafeImage";
import {
  ADMIN_HOME_SECTION_COMMON as COMMON,
  type AdminHomeSectionKind,
} from "@/src/constants/admin-home-sections";
import { tenGiangVien, type Course } from "@/src/services/course";

import { SECTION_CONFIG } from "../config";
import styles from "../AdminHomeSection.module.scss";

interface HomeSectionRowProps {
  kind: AdminHomeSectionKind;
  course: Course;
  updating: boolean;
  onToggle: (id: string, currentStatus: boolean) => void;
}

/** Mot khoa hoc: anh, ten, giang vien/cap do, cot so lieu, cong tac ghim. */
export default function HomeSectionRow({
  kind,
  course,
  updating,
  onToggle,
}: HomeSectionRowProps) {
  const cfg = SECTION_CONFIG[kind];
  const pinned = !!course[cfg.tag];
  const instructorName =
    tenGiangVien(course.instructor) ||
    COMMON.instructorFallback(String(course.instructor));

  const metric =
    cfg.metric === "createdAt"
      ? course.createdAt
        ? new Date(course.createdAt).toLocaleDateString("vi-VN")
        : COMMON.noDate
      : `${(course.studentsCount || 0).toLocaleString()} ${COMMON.students}`;

  return (
    <tr className={styles.row4}>
      <td className={styles.headCell}>
        <div className={styles.row2}>
          <SafeImage
            src={course.thumbnail || COMMON.noImage}
            alt={course.title}
            width={56}
            height={36}
            className={styles.box4}
          />
          <span className={styles.label}>{course.title}</span>
        </div>
      </td>
      <td className={styles.headCell}>
        <p className={styles.text2}>{instructorName}</p>
        <p className={styles.text3}>{course.level}</p>
      </td>
      <td className={`${styles.cell} ${cfg.cellClass}`}>{metric}</td>
      <td className={styles.headCell2}>
        <button
          type="button"
          disabled={updating}
          onClick={() => onToggle(course._id, pinned)}
          className={`${styles.button4} ${
            pinned ? `${styles.button} ${cfg.buttonClass}` : styles.button2
          } ${updating ? styles.button3 : ""}`}
        >
          <span
            className={`${styles.label4} ${pinned ? styles.label2 : styles.label3}`}
          />
        </button>
      </td>
    </tr>
  );
}
