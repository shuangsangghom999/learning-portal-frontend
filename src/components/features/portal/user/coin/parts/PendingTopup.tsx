import Image from "next/image";
import { Clock } from "lucide-react";

import CopyButton from "@/src/components/ui/CopyButton";
import { USER_COIN as C } from "@/src/constants/portal/user-coin-page";
import { formatVnd } from "@/src/lib/format";
import { dangDongHo } from "@/src/lib/time";
import type { YeuCauNap } from "@/src/services/coin.api";

import type { CoinTopupState } from "../hooks/useCoinTopup";
import styles from "../UserCoin.module.scss";

/** Yeu cau dang cho: ma QR, thong tin chuyen khoan, bao da chuyen / huy. */
export default function PendingTopup({
  s,
  yeuCau,
}: {
  s: CoinTopupState;
  yeuCau: YeuCauNap;
}) {
  const P = C.pending;
  const ck = yeuCau.chuyenKhoan;
  const copy = { className: styles.button, withIcon: true };

  return (
    <section className={styles.section}>
      <div className={styles.row2}>
        <h2 className={styles.heading}>
          {P.heading(formatVnd(yeuCau.amount), yeuCau.soCoin.toLocaleString("vi-VN"))}
        </h2>
        <span className={styles.label}>
          <Clock size={13} /> {dangDongHo(s.conLai)}
        </span>
      </div>

      {ck?.daCauHinh ? (
        <div className={styles.grid}>
          <div className={styles.col}>
            {ck.anhQR && (
              <Image
                src={ck.anhQR}
                alt={P.qrAlt(formatVnd(yeuCau.amount), yeuCau.code)}
                width={280}
                height={380}
                unoptimized
                referrerPolicy="no-referrer"
                className={styles.box3}
              />
            )}
            <p className={styles.text5}>{P.qrHint}</p>
          </div>

          <dl className={styles.stack}>
            <div className={styles.row3}>
              <dt className={styles.box4}>{P.bank}</dt>
              <dd className={styles.box5}>{ck.nganHang}</dd>
            </div>
            <div className={styles.row3}>
              <dt className={styles.box4}>{P.accountNo}</dt>
              <dd className={styles.row4}>
                {ck.soTaiKhoan}{" "}
                <CopyButton value={ck.soTaiKhoan} what={P.copyAccount} {...copy} />
              </dd>
            </div>
            <div className={styles.row3}>
              <dt className={styles.box4}>{P.accountName}</dt>
              <dd className={styles.box5}>{ck.tenTaiKhoan}</dd>
            </div>
            <div className={styles.row3}>
              <dt className={styles.box4}>{P.amount}</dt>
              <dd className={styles.row4}>
                {formatVnd(yeuCau.amount)}{" "}
                <CopyButton value={String(yeuCau.amount)} what={P.copyAmount} {...copy} />
              </dd>
            </div>
            <div className={styles.row5}>
              <dt className={styles.box4}>{P.content}</dt>
              <dd className={styles.row6}>
                {yeuCau.code}{" "}
                <CopyButton value={yeuCau.code} what={P.copyContent} {...copy} />
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className={styles.text6}>
          {P.noBank.a}
          <strong>{yeuCau.code}</strong>
          {P.noBank.b}
        </p>
      )}

      {/* Ma nay la thu DUY NHAT noi khoan tien voi yeu cau nap. Nhac rieng
          mot dong vi day la cho hay sai nhat: thieu ma thi tien ve toi noi
          ma khong ai biet la cua ai. */}
      <p className={styles.text7}>
        {P.mustInclude.a}
        <strong>{P.mustInclude.strong}</strong>
        {P.mustInclude.b}
        <b>{yeuCau.code}</b>
        {P.mustInclude.c}
      </p>

      {s.daBao ? (
        // KHONG bao "tai lai trang de xem" nhu truoc nua: tai lai la mat ma.
        // Trang tu do may chu 5 giay mot lan, coin vao la no tu doi.
        <p className={`${styles.text13} ${s.mailHong ? styles.text8 : styles.text9}`}>
          {P.reported}
          {s.mailHong && (
            <>
              {" "}
              {P.mailFailed.a}
              <strong className={styles.strong}>{yeuCau.code}</strong>
              {P.mailFailed.b}
            </>
          )}
        </p>
      ) : (
        <div className={styles.row7}>
          <button onClick={s.bao} disabled={s.dangBao} className={styles.button2}>
            {s.dangBao ? P.sending : P.iTransferred}
          </button>
          <button onClick={s.huy} className={styles.button3}>
            {P.cancel}
          </button>
        </div>
      )}

      <button onClick={s.kiemTraLai} className={styles.button4}>
        {P.recheck}
      </button>
    </section>
  );
}
