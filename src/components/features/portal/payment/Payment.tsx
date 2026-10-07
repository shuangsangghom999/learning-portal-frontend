"use client";

import { Suspense } from "react";

import { PAYMENT as P } from "@/src/constants/portal/payment-page";

import { usePayment } from "./hooks/usePayment";
import PaymentClosed from "./parts/PaymentClosed";
import PaymentNotice from "./parts/PaymentNotice";
import PaymentPaid from "./parts/PaymentPaid";
import PaymentPending from "./parts/PaymentPending";
import styles from "./Payment.module.scss";

function PaymentContent() {
  const s = usePayment();
  const { don } = s;

  if (!s.ma) return <PaymentNotice text={P.missingCode} />;

  if (s.dangTai) {
    return <div className={styles.container2}>{P.loadingOrder}</div>;
  }

  if (s.loi && !don) return <PaymentNotice text={s.loi} />;

  if (!don) return null;

  // --- Đơn đã thanh toán -----------------------------------------------
  if (don.status === "paid") return <PaymentPaid don={don} />;

  // --- Đơn đã hủy hoặc hết hạn ------------------------------------------
  if (don.status === "cancelled" || don.status === "expired") {
    return <PaymentClosed don={don} dangTaoLai={s.dangTaoLai} onNewCode={s.taoMaMoi} />;
  }

  // --- Đơn đang chờ thanh toán ------------------------------------------
  return <PaymentPending s={s} don={don} />;
}

export default function Payment() {
  // useSearchParams bắt buộc phải nằm trong Suspense, nếu không Next từ chối
  // build trang này ở chế độ tĩnh.
  return (
    <Suspense fallback={<div className={styles.container2}>{P.loadingFallback}</div>}>
      <PaymentContent />
    </Suspense>
  );
}
