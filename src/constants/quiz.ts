/** Cau bao dung chung cua man hinh soan quiz (admin va giang vien). */
export const QUIZ_DRAFT_MESSAGES = {
  emptyQuestion: (cau: number) => `Câu hỏi số ${cau} chưa điền nội dung!`,
  emptyOption: (phuongAn: number, cau: number) =>
    `Phương án lựa chọn số ${phuongAn} của Câu hỏi ${cau} đang trống!`,
} as const;
