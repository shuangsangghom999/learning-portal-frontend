import Link from "next/link";

import { PAYMENT as P } from "@/src/constants/payment";
import { khoaTrongDon } from "@/src/lib/order";
import type { DonHang } from "@/src/services/order";

import styles from "../Payment.module.scss";

/** Don da thanh toan: bao thanh cong va dan vao hoc. */
export default function PaymentPaid({ don }: { don: DonHang }) {
  const T = P.paid;
  const soKhoa = khoaTrongDon(don).length;

  return (
    <div className={styles.container3}>
      <div className={styles.box2}>{T.check}</div>
      <h1 className={styles.title}>{T.title}</h1>
      <p className={styles.text2}>
        {soKhoa > 1 ? (
          <>
            <strong>{T.many.strong(soKhoa)}</strong>
            {T.many.rest}
          </>
        ) : (
          <>
            {T.one.a}
            <strong>{don.course?.title}</strong>
            {T.one.b}
          </>
        )}
      </p>
      <Link
        href={
          soKhoa > 1
            ? P.myCoursesHref
            : don.course
              ? P.learnHref(don.course.slug)
              : P.coursesHref
        }
        className={styles.box3}
      >
        {soKhoa > 1 ? T.toMyCourses : T.learnNow}
      </Link>
    </div>
  );
}
