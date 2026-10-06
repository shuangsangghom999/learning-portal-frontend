import { PAYMENT as P } from "@/src/constants/payment";
import type { DonHang } from "@/src/services/order";

import type { PaymentState } from "../hooks/usePayment";
import styles from "../Payment.module.scss";

/** Nut "Tôi đã chuyển khoản" va ket qua bao. */
export default function ReportTransfer({ s, don }: { s: PaymentState; don: DonHang }) {
  const R = P.report;

  return (
    <>
      {/* Nút báo đã chuyển khoản.
          Trước đây học viên chuyển xong chỉ biết ngồi đợi, còn quản trị thì
          phải tự mở trang xem có đơn mới không — tức là hoặc ngồi canh màn
          hình cả ngày, hoặc để người ta chờ. Nút này gửi một mail thẳng vào
          hộp thư quản trị kèm mã đơn để tra sao kê. */}
      {don.daBaoChuyenKhoanLuc ? (
        <div className={styles.card2}>
          <p className={styles.text7}>
            {R.reportedAt}
            {new Date(don.daBaoChuyenKhoanLuc).toLocaleString("vi-VN")}
          </p>
          <p className={styles.text8}>{R.reportedText}</p>
        </div>
      ) : (
        <div className={styles.card3}>
          <p className={styles.text9}>{R.hint}</p>
          <button
            type="button"
            onClick={s.bamDaChuyen}
            disabled={s.dangBao}
            className={styles.button4}
          >
            {s.dangBao ? R.sending : R.iTransferred}
          </button>
        </div>
      )}

      {s.ketQuaBao && (
        <p
          className={`${styles.text13} ${
            s.ketQuaBao.mailHong ? styles.text10 : styles.text11
          }`}
        >
          {s.ketQuaBao.chu}
          {s.ketQuaBao.mailHong && (
            <>
              {" "}
              {R.mailFailed.a}
              <strong className={styles.label2}>{don.code}</strong>
              {R.mailFailed.b}
            </>
          )}
        </p>
      )}
    </>
  );
}
