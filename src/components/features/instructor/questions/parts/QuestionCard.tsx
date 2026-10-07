import Link from "next/link";
import { CircleCheck, Send } from "lucide-react";

import AnhDaiDien from "@/src/components/ui/Avatar";
import { INSTRUCTOR_QUESTIONS as C } from "@/src/constants/instructor/questions-page";
import { khoangCach, tenHienThi } from "@/src/lib/time";
import type { CauHoiChoGiangVien } from "@/src/services/question";

import styles from "../InstructorQuestions.module.scss";

const tenCua = (n: { name?: string; email?: string } | null): string =>
  tenHienThi(n, C.item.studentFallback);

interface QuestionCardProps {
  c: CauHoiChoGiangVien;
  dangMo: boolean;
  chuTraLoi: string;
  dangGui: boolean;
  onBatTat: () => void;
  onChu: (v: string) => void;
  onHuy: () => void;
  onGui: () => void;
}

/** Mot cau hoi: khoa/bai, nguoi hoi, cac tra loi va o tra loi cua giang vien. */
export default function QuestionCard({
  c,
  dangMo,
  chuTraLoi,
  dangGui,
  onBatTat,
  onChu,
  onHuy,
  onGui,
}: QuestionCardProps) {
  return (
    <article className={styles.article}>
      {/* Ten khoa va ten bai la thu quan trong nhat o man hinh nay: danh
          sach tron cau hoi cua moi khoa, khong biet cau nay o dau thi
          khong tra loi duoc. */}
      <div className={styles.row3}>
        <span className={styles.label}>{c.course?.title || C.item.deletedCourse}</span>
        {c.lesson?.title && <span className={styles.label2}>· {c.lesson.title}</span>}
        {c.daGiaiQuyet && (
          <span className={styles.row4}>
            <CircleCheck size={11} /> {C.item.answered}
          </span>
        )}
      </div>

      <div className={styles.row5}>
        <AnhDaiDien
          src={c.student?.avatar}
          ten={tenCua(c.student)}
          size={36}
          nenChuCai={styles.box6}
        />

        <div className={styles.box3}>
          <div className={styles.row6}>
            <span className={styles.label3}>{tenCua(c.student)}</span>
            <span className={styles.label4}>{khoangCach(c.createdAt)}</span>
          </div>

          <p className={styles.text4}>{c.noiDung}</p>

          {c.traLoi.length > 0 && (
            <div className={styles.col2}>
              {c.traLoi.map((t) => (
                <div key={t._id}>
                  <span className={styles.label5}>{tenCua(t.user)}</span>
                  <p className={styles.text5}>{t.noiDung}</p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.row7}>
            <button type="button" onClick={onBatTat} className={styles.button3}>
              {C.item.reply}
            </button>

            {c.course?.slug && (
              <Link href={C.courseHref(c.course.slug)} className={styles.box4}>
                {C.item.openCourse}
              </Link>
            )}
          </div>

          {dangMo && (
            <div className={styles.box5}>
              <textarea
                id={C.replyInputId(c._id)}
                value={chuTraLoi}
                onChange={(e) => onChu(e.target.value)}
                rows={3}
                placeholder={C.item.replyPlaceholder}
                className={styles.textarea}
              />
              <div className={styles.row8}>
                <button type="button" onClick={onHuy} className={styles.button4}>
                  {C.item.cancel}
                </button>
                <button
                  type="button"
                  onClick={onGui}
                  disabled={!chuTraLoi.trim() || dangGui}
                  className={styles.button5}
                >
                  <Send size={14} /> {C.item.send}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
