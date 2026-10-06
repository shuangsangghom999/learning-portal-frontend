import type {
  Enrollment,
  EnrollmentByCourseResponse,
  LessonProgress,
} from "@/src/services/enrollment.api";

// Backend tra ve 200 kem isEnrolled: false khi chua dang ky chu khong tra 404,
// nen phai thu hep kieu truoc thi moi doc duoc lessonProgress.
export const daDangKy = (
  e: EnrollmentByCourseResponse | null,
): e is { isEnrolled: true } & Enrollment => Boolean(e && e.isEnrolled === true);

// lessonProgress.lesson khi la ObjectId dang chuoi, khi la ca doi tuong bai hoc
// da populate - tuy endpoint nao tra ve.
export const layIdBaiHoc = (lesson: LessonProgress["lesson"]): string | undefined =>
  typeof lesson === "string" ? lesson : (lesson?._id ?? undefined);

// Doc lessonProgress ma khong phai kiem tra isEnrolled lap lai o tung cho.
export const layTienDo = (e: EnrollmentByCourseResponse | null): LessonProgress[] =>
  daDangKy(e) ? e.lessonProgress : [];
