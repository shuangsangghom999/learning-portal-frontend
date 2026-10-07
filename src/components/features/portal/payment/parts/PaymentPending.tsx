import NutMuaBangCoin from "@/src/components/common/BuyWithCoinButton";
import { PAYMENT as P } from "@/src/constants/portal/payment-page";
import { khoaTrongDon } from "@/src/lib/order";
import { dinhDangTien, type DonHang } from "@/src/services/order";
import { HIEN_COIN } from "@/src/services/tinhNang";

import type { PaymentState } from "../hooks/usePayment";
import styles from "../Payment.module.scss";
import BankTransfer from "./BankTransfer";
import HoldClock from "./HoldClock";
import OrderItems from "./OrderItems";
import ReportTransfer from "./ReportTransfer";

/** Don dang cho thanh toan. */
export default function PaymentPending({ s, don }: { s: PaymentState; don: DonHang }) {
  const T = P.pending;
  const ck = don.chuyenKhoan;

  return (
    <div className={styles.container4}>
      {/* Đồng hồ giữ đơn */}
      <HoldClock conLai={s.conLai} daBao={Boolean(don.daBaoChuyenKhoanLuc)} />

      <h1 className={styles.title2}>{T.title}</h1>
      <p className={styles.text2}>
        {T.intro.a}
        <strong>{dinhDangTien(don.amount)}</strong>
        {T.intro.b}
        <span className={styles.label}>{don.code}</span>
        {T.intro.c}
      </p>

      {/* Các mục trong đơn */}
      <OrderItems don={don} />

      {/* Tra bang coin, dat TRUOC khoi QR - chi khi coin dang bat
          (services/tinhNang.ts). Don gio hang khong co nut nay: nut mua bang
          coin chi mua duoc mot khoa, dat o day la tra coin cho khoa dau con cac
          khoa sau van nam trong don cho chuyen khoan. */}
      {HIEN_COIN &&
        don.status === "pending" &&
        don.course?._id &&
        khoaTrongDon(don).length <= 1 && (
          <section className={styles.section2} aria-label={P.coin.aria}>
            <h2 className={styles.heading2}>{P.coin.heading}</h2>
            <p className={styles.text5}>{P.coin.text}</p>
            <NutMuaBangCoin
              courseId={don.course._id}
              gia={don.amount}
              khiMuaXong={s.khiMuaBangCoinXong}
            />
          </section>
        )}

      {/* Chưa khai báo tài khoản nhận tiền */}
      {ck && !ck.daCauHinh && (
        <div className={styles.card}>
          {P.bank.notConfigured.a}
          <strong>{don.code}</strong>
          {P.bank.notConfigured.b}
        </div>
      )}

      {ck?.daCauHinh && (
        <BankTransfer
          don={don}
          ck={ck}
          daChepHet={s.daChepHet}
          onCopyAll={s.chepThongTin}
        />
      )}

      <ReportTransfer s={s} don={don} />

      {s.loi && <p className={styles.text12}>{s.loi}</p>}

      <div className={styles.box13}>
        <button
          type="button"
          onClick={s.huy}
          disabled={s.dangHuy}
          className={styles.button5}
        >
          {s.dangHuy ? T.cancelling : T.cancel}
        </button>
      </div>
    </div>
  );
}
