import { MessageCircleQuestion } from "lucide-react";

import { INSTRUCTOR_QUESTIONS as C } from "@/src/constants/instructor-questions";

import styles from "../InstructorQuestions.module.scss";

interface QuestionsToolbarProps {
  dangTai: boolean;
  tatCa: boolean;
  tong: number;
  onTatCa: (v: boolean) => void;
}

/** Tieu de, dong tom tat so cau va hai tab Cho tra loi / Tat ca. */
export default function QuestionsToolbar({
  dangTai,
  tatCa,
  tong,
  onTatCa,
}: QuestionsToolbarProps) {
  return (
    <>
      <div className={styles.row}>
        <MessageCircleQuestion size={22} className={styles.box} />
        <h1 className={styles.title}>{C.title}</h1>
      </div>

      <p className={styles.text}>
        {dangTai
          ? C.summary.loading
          : tatCa
            ? C.summary.all(tong)
            : C.summary.pending(tong)}
      </p>

      <div className={styles.row2}>
        <button
          type="button"
          onClick={() => onTatCa(false)}
          className={`${styles.button6} ${!tatCa ? styles.button : styles.button2}`}
        >
          {C.tabs.pending}
        </button>
        <button
          type="button"
          onClick={() => onTatCa(true)}
          className={`${styles.button6} ${tatCa ? styles.button : styles.button2}`}
        >
          {C.tabs.all}
        </button>
      </div>
    </>
  );
}
