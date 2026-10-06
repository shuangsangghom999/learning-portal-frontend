import { QUIZ_DRAFT_MESSAGES as M } from "@/src/constants/quiz";
import type { QuizQuestion } from "@/src/services/quizService";
import type { CauHoiSoan, QuizConfigDraft } from "@/src/types/quiz-draft";

/** Cau hoi trong: trac nghiem mot dap an, 1 diem, hai phuong an (A dung). */
export const cauHoiTrong = (): CauHoiSoan => ({
  text: "",
  type: "multiple_choice",
  points: 1,
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
});

/** Cau hinh mac dinh cua quiz moi. */
export const cauHinhQuizMacDinh = (lessonId = ""): QuizConfigDraft => ({
  title: "",
  description: "",
  lessonId,
  passingScore: 70,
  timeLimit: 15,
  attempts: 1,
});

// Du lieu tu may chu de trong duoc points va options, con man hinh soan thao thi
// khong - dien gia tri mac dinh mot lan o day, thay vi kiem tra undefined o tung
// o nhap lieu.
export const veDangSoan = (ds: QuizQuestion[]): CauHoiSoan[] =>
  ds.map((q) => ({
    text: q.text ?? "",
    type: q.type,
    points: q.points ?? 1,
    options: (q.options ?? []).map((o) => ({
      text: o.text ?? "",
      isCorrect: Boolean(o.isCorrect),
    })),
  }));

/**
 * Tim cau hoi / phuong an con trong truoc khi tao quiz.
 * Tra ve cau bao loi dau tien, hoac null neu da dien du.
 */
export function timChoTrong(questions: CauHoiSoan[]): string | null {
  for (let i = 0; i < questions.length; i++) {
    if (!questions[i].text.trim()) return M.emptyQuestion(i + 1);
    for (let j = 0; j < questions[i].options.length; j++) {
      if (!questions[i].options[j].text.trim()) {
        return M.emptyOption(j + 1, i + 1);
      }
    }
  }
  return null;
}

/** Doi danh sach cau hoi dang soan thanh du lieu gui len API. */
export const cauHoiGuiDi = (questions: CauHoiSoan[]) =>
  questions.map((q) => ({
    text: q.text.trim(),
    type: q.type,
    points: Number(q.points) || 1,
    options: q.options.map((opt) => ({
      text: opt.text.trim(),
      isCorrect: !!opt.isCorrect,
    })),
  }));
