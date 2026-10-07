import { Power, Users } from "lucide-react";

import { ADMIN_VOUCHERS as C } from "@/src/constants/admin/vouchers-page";

import type { MaHienThi } from "../hooks/useAdminVouchers";
import styles from "../AdminVouchers.module.scss";

const dinhDangNgay = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");
const tien = (n: number) => n.toLocaleString("vi-VN");

interface VoucherRowProps {
  m: MaHienThi;
  onUsage: (id: string) => void;
  onToggle: (id: string) => void;
}

/** Mot ma: muc giam, dieu kien, hieu luc, so lan dung, trang thai, thao tac. */
export default function VoucherRow({ m, onUsage, onToggle }: VoucherRowProps) {
  const R = C.row;

  return (
    <tr className={styles.row4}>
      <td className={styles.headCell}>
        <p className={styles.text3}>{m.ma}</p>
        {m.moTa && <p className={styles.text4}>{m.moTa}</p>}
      </td>
      <td className={styles.cell}>
        {m.loai === "phanTram" ? `${m.giaTri}%` : `${tien(m.giaTri)}đ`}
        {m.giamToiDa ? (
          <span className={styles.label4}>{R.capNote(tien(m.giamToiDa))}</span>
        ) : null}
      </td>
      <td className={styles.cell2}>
        {m.donToiThieu > 0 ? R.minOrder(tien(m.donToiThieu)) : R.noMinOrder}
        <span className={styles.label5}>
          {m.moiNguoiMotLan ? R.oncePerUser : R.unlimitedPerUser}
        </span>
      </td>
      <td className={styles.cell3}>
        {R.range(dinhDangNgay(m.batDau), dinhDangNgay(m.ketThuc))}
      </td>
      <td className={styles.cell4}>
        {m.daDung}
        {m.soLuotToiDa ? ` / ${m.soLuotToiDa}` : ""}
      </td>
      <td className={styles.headCell}>
        {/* Het han va bi tat la HAI chuyen khac nhau: mot cai tu
            het theo ngay, mot cai do quan tri chu dong tat. Gop
            lam mot nhan la quan tri khong biet co can bam gi khong. */}
        <span
          className={`${styles.label10} ${
            !m.hoatDong ? styles.label6 : m.hetHan ? styles.label7 : styles.label8
          }`}
        >
          {!m.hoatDong ? R.disabled : m.hetHan ? R.expired : R.running}
        </span>
      </td>
      <td className={styles.headCell}>
        <div className={styles.row5}>
          <button
            type="button"
            onClick={() => onUsage(m._id)}
            aria-label={R.viewUsesAria}
            className={styles.button4}
          >
            <Users size={15} />
          </button>
          <button
            type="button"
            onClick={() => onToggle(m._id)}
            aria-label={m.hoatDong ? R.turnOffAria : R.turnOnAria}
            className={`${styles.button8} ${m.hoatDong ? styles.button5 : styles.button6}`}
          >
            <Power size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
