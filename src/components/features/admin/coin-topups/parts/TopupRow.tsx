import { Ban, Check, Clock } from "lucide-react";

import { ADMIN_COIN_TOPUPS as C } from "@/src/constants/admin/coin-topups-page";
import type { TrangThaiNap, YeuCauNapAdmin } from "@/src/services/coin.api";

import styles from "../AdminCoinTopups.module.scss";

/** Lop mau cua nhan trang thai. */
const LOP_NHAN: Record<TrangThaiNap, string> = {
  pending: styles.nhanCho,
  paid: styles.nhanXong,
  cancelled: styles.nhanHuy,
  expired: styles.nhanQuaHan,
};

const gio = (s?: string | null) =>
  s ? new Date(s).toLocaleString("vi-VN", { hour12: false }) : C.row.none;

interface TopupRowProps {
  yc: YeuCauNapAdmin;
  busy: boolean;
  onConfirm: (yc: YeuCauNapAdmin) => void;
  onCancel: (yc: YeuCauNapAdmin) => void;
}

/** Mot yeu cau nap: hoc vien, ma, so coin, so tien, luc bao, trang thai + nut. */
export default function TopupRow({ yc, busy, onConfirm, onCancel }: TopupRowProps) {
  const choXuLy = yc.status === "pending" || yc.status === "expired";

  return (
    <tr className={styles.row2}>
      <td className={styles.headCell}>
        <p className={styles.text3}>{yc.student?.name || C.row.deleted}</p>
        <p className={styles.text4}>{yc.student?.email || C.row.none}</p>
      </td>
      <td className={styles.headCell}>
        <p className={styles.text5}>{yc.code}</p>
        <p className={styles.text6}>{gio(yc.createdAt)}</p>
      </td>
      <td className={styles.cell3}>{yc.soCoin.toLocaleString("vi-VN")}</td>
      <td className={styles.cell4}>{yc.amount.toLocaleString("vi-VN")}đ</td>
      <td className={styles.cell5}>
        {yc.daBaoChuyenKhoanLuc ? (
          <span className={styles.label}>
            <Clock size={12} /> {gio(yc.daBaoChuyenKhoanLuc)}
          </span>
        ) : (
          C.row.notReported
        )}
      </td>
      <td className={styles.headCell}>
        <div className={styles.row3}>
          <span className={`${styles.label2} ${LOP_NHAN[yc.status]}`}>
            {C.statusLabel[yc.status]}
          </span>
          {choXuLy && (
            <>
              <button
                onClick={() => onConfirm(yc)}
                disabled={busy}
                title={C.row.confirmTitle}
                className={styles.button3}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => onCancel(yc)}
                disabled={busy}
                title={C.row.cancelTitle}
                className={styles.button4}
              >
                <Ban size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
