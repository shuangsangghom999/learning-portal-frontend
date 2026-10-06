"use client";

import { useEffect, useState } from "react";

import { MY_COURSES as C, type MyCoursesFilter } from "@/src/constants/my-courses";
import {
  getMyEnrolledCourses,
  type EnrolledCourseItem,
} from "@/src/services/enrollment.api";

/** Khoa hoc da ghi danh cua minh, loc dang hoc / da xong / tat ca. */
export function useMyCourses() {
  const [danhSach, setDanhSach] = useState<EnrolledCourseItem[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [boLoc, setBoLoc] = useState<MyCoursesFilter>("dangHoc");

  useEffect(() => {
    let conSong = true;

    getMyEnrolledCourses()
      .then((ds) => {
        if (!conSong) return;
        setDanhSach(Array.isArray(ds) ? ds : []);
      })
      .catch((e) => {
        if (!conSong) return;
        setLoi(e instanceof Error ? e.message : C.loadFailed);
      })
      .finally(() => {
        if (conSong) setDangTai(false);
      });

    return () => {
      conSong = false;
    };
  }, []);

  // Bo ban ghi co course === null.
  //
  // May chu populate mot phan va tra null khi khoa hoc da bi xoa - xem ghi chu
  // o EnrolledCourseSummary. Khong loc thi cho nay ve mot the trong khong bam
  // duoc, va nguoi dung tuong giao dien hong.
  const coKhoa = danhSach.filter((g) => g.course);

  const loc = coKhoa.filter((g) => {
    if (boLoc === "tatCa") return true;
    if (boLoc === "xong") return g.status === "completed" || g.totalProgress >= 100;
    return g.status !== "completed" && g.totalProgress < 100;
  });

  const soDangHoc = coKhoa.filter(
    (g) => g.status !== "completed" && g.totalProgress < 100,
  ).length;
  const soXong = coKhoa.length - soDangHoc;

  return { dangTai, loi, boLoc, setBoLoc, coKhoa, loc, soDangHoc, soXong };
}
