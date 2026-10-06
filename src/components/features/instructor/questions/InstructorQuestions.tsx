"use client";

import { useInstructorQuestions } from "./hooks/useInstructorQuestions";
import QuestionCard from "./parts/QuestionCard";
import QuestionsEmpty from "./parts/QuestionsEmpty";
import QuestionsToolbar from "./parts/QuestionsToolbar";
import styles from "./InstructorQuestions.module.scss";

/** Trang /instructor/questions - hang doi cau hoi cua hoc vien. */
export default function InstructorQuestions() {
  const q = useInstructorQuestions();

  return (
    <div className={styles.container}>
      <QuestionsToolbar
        dangTai={q.dangTai}
        tatCa={q.tatCa}
        tong={q.tong}
        onTatCa={q.setTatCa}
      />

      {q.loi && <p className={styles.text2}>{q.loi}</p>}

      {!q.dangTai && q.danhSach.length === 0 && <QuestionsEmpty tatCa={q.tatCa} />}

      <div className={styles.col}>
        {q.danhSach.map((c) => (
          <QuestionCard
            key={c._id}
            c={c}
            dangMo={q.dangTraLoi === c._id}
            chuTraLoi={q.chuTraLoi}
            dangGui={q.dangGui}
            onBatTat={() => q.batTatTraLoi(c._id)}
            onChu={q.setChuTraLoi}
            onHuy={() => q.setDangTraLoi(null)}
            onGui={() => q.gui(c._id)}
          />
        ))}
      </div>
    </div>
  );
}
