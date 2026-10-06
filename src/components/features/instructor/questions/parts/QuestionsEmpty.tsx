import { CircleCheck } from "lucide-react";

import { INSTRUCTOR_QUESTIONS as C } from "@/src/constants/instructor-questions";

import styles from "../InstructorQuestions.module.scss";

export default function QuestionsEmpty({ tatCa }: { tatCa: boolean }) {
  return (
    <div className={styles.card}>
      <CircleCheck size={30} className={styles.box2} />
      <p className={styles.text3}>{tatCa ? C.empty.all : C.empty.pending}</p>
    </div>
  );
}
