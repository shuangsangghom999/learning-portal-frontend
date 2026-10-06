"use client";

import { useCallback, useEffect, useState } from "react";

import { INSTRUCTOR_QUESTIONS as C } from "@/src/constants/instructor-questions";
import {
  layCauHoiChoGiangVien,
  traLoiCauHoi,
  type CauHoiChoGiangVien,
} from "@/src/services/question";

/** Danh sach cau hoi (cho tra loi / tat ca), mo o tra loi va gui tra loi. */
export function useInstructorQuestions() {
  const [danhSach, setDanhSach] = useState<CauHoiChoGiangVien[]>([]);
  const [tong, setTong] = useState(0);
  const [tatCa, setTatCa] = useState(false);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const [dangTraLoi, setDangTraLoi] = useState<string | null>(null);
  const [chuTraLoi, setChuTraLoi] = useState("");
  const [dangGui, setDangGui] = useState(false);

  const nap = useCallback(async () => {
    setDangTai(true);
    setLoi("");

    try {
      const kq = await layCauHoiChoGiangVien(1, tatCa);
      setDanhSach(kq.danhSach);
      setTong(kq.tong);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.errors.load);
    } finally {
      setDangTai(false);
    }
  }, [tatCa]);

  useEffect(() => {
    // Day sang microtask thay vi goi thang trong than effect - xem ghi chu
    // cung kieu o ChuongThongBao va HoiDapBaiHoc.
    queueMicrotask(nap);
  }, [nap]);

  /** Bam "Tra loi" lan nua tren cung cau thi dong lai. */
  const batTatTraLoi = (id: string) => {
    setDangTraLoi(dangTraLoi === id ? null : id);
    setChuTraLoi("");
  };

  const gui = async (id: string) => {
    const cau = chuTraLoi.trim();
    if (!cau || dangGui) return;

    setDangGui(true);

    try {
      const kq = await traLoiCauHoi(id, cau);
      setChuTraLoi("");
      setDangTraLoi(null);

      // Dang o che do "chua tra loi" thi cau vua tra loi phai BIEN KHOI danh
      // sach: day la hang doi viec, tra loi xong la xong viec. Che do "tat ca"
      // thi giu lai va cap nhat tai cho.
      if (!tatCa) {
        setDanhSach((cu) => cu.filter((c) => c._id !== id));
        setTong((n) => Math.max(0, n - 1));
      } else {
        setDanhSach((cu) =>
          cu.map((c) =>
            c._id === id ? { ...c, ...kq.cauHoi, course: c.course, lesson: c.lesson } : c,
          ),
        );
      }
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.errors.send);
    } finally {
      setDangGui(false);
    }
  };

  return {
    danhSach,
    tong,
    tatCa,
    setTatCa,
    dangTai,
    loi,
    dangTraLoi,
    setDangTraLoi,
    chuTraLoi,
    setChuTraLoi: (v: string) => setChuTraLoi(v.slice(0, C.maxLength)),
    dangGui,
    batTatTraLoi,
    gui,
  };
}
