import Link from "next/link";

import { PAYMENT as P } from "@/src/constants/payment";
import { khoaTrongDon } from "@/src/lib/order";
import type { DonHang } from "@/src/services/order";

import styles from "../Payment.module.scss";

interface PaymentClosedProps {
  don: DonHang;
  dangTaoLai: boolean;
  onNewCode: () => void;
}

/** Don da huy hoac het han: cho lay ma moi ngay tai cho. */
export default function PaymentClosed({
  don,
  dangTaoLai,
  onNewCode,
}: PaymentClosedProps) {
  const T = P.closed;
  const daHuy = don.status === "cancelled";
  const nhieuKhoa = khoaTrongDon(don).length > 1;

  return (
    <div className={styles.container3}>
      <h1 className={styles.title}>{daHuy ? T.cancelledTitle : T.expiredTitle}</h1>
      <p className={styles.text2}>{daHuy ? T.cancelledText : T.expiredText}</p>
      <div className={styles.row}>
        {/* Tao thang ma moi ngay tai day. Truoc day chi co duong quay ve
            trang khoa hoc roi bam Mua lai - ba buoc cho mot viec. */}
        {don.course && (
          <button onClick={onNewCode} disabled={dangTaoLai} className={styles.button2}>
            {dangTaoLai ? T.creating : T.newCode}
          </button>
        )}
        <Link
          href={
            nhieuKhoa
              ? P.cartHref
              : don.course
                ? P.courseHref(don.course.slug)
                : P.coursesHref
          }
          className={styles.box4}
        >
          {nhieuKhoa ? T.backToCart : T.backToCourse}
        </Link>
      </div>
    </div>
  );
}
