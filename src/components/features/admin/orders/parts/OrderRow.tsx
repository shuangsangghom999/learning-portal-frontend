import { ADMIN_ORDERS as C } from "@/src/constants/admin/orders-page";
import { dinhDangTien, type DonHangAdmin, type TrangThaiDon } from "@/src/services/order";

import styles from "../AdminOrders.module.scss";

// Mau nhan trang thai don. Truoc day la chuoi lop Tailwind dat thang o day;
// go Tailwind xong thi bon trang thai don nhin y het nhau.
const KIEU_NHAN: Record<TrangThaiDon, string> = {
  pending: styles.nhanCho,
  paid: styles.nhanXong,
  cancelled: styles.nhanHuy,
  expired: styles.nhanQuaHan,
};

const ngayGio = (chuoi: string) =>
  new Date(chuoi).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface OrderRowProps {
  don: DonHangAdmin;
  busy: boolean;
  onConfirm: (don: DonHangAdmin) => void;
  onCancel: (don: DonHangAdmin) => void;
}

/** Mot don: ma, hoc vien, khoa (ca gio hang), tien, trang thai, thao tac. */
export default function OrderRow({ don, busy, onConfirm, onCancel }: OrderRowProps) {
  return (
    <tr className={styles.row4}>
      <td className={styles.cell2}>{don.code}</td>
      <td className={styles.headCell}>
        <div className={styles.box2}>{don.student?.name ?? C.row.none}</div>
        <div className={styles.box3}>{don.student?.email ?? ""}</div>
      </td>
      <td className={styles.cell3}>
        {/* Don gio hang: hien du ten moi khoa - quan tri doi chieu
            mot dong sao ke voi CA don, can biet don tra cho nhung gi. */}
        <div className={styles.box4}>
          {don.courses && don.courses.length > 1
            ? C.row.cartCourses(
                don.courses.length,
                don.courses.map((k) => k.title).join(", "),
              )
            : (don.course?.title ?? C.row.none)}
        </div>
      </td>
      <td className={styles.cell4}>{dinhDangTien(don.amount)}</td>
      <td className={styles.headCell}>
        <span className={`${styles.label4} ${KIEU_NHAN[don.status]}`}>
          {C.statusLabel[don.status]}
        </span>
        {don.confirmedBy && (
          <div className={styles.box5}>{C.row.confirmedBy(don.confirmedBy.name)}</div>
        )}
        {don.daBaoChuyenKhoanLuc && don.status !== "paid" && (
          <div className={styles.box6}>
            {C.row.reportedAt(ngayGio(don.daBaoChuyenKhoanLuc))}
          </div>
        )}
      </td>
      <td className={styles.cell5}>{ngayGio(don.createdAt)}</td>
      <td className={styles.cell6}>
        {don.status === "paid" ? (
          <span className={styles.label3}>{C.row.processed}</span>
        ) : don.status === "cancelled" ? (
          <span className={styles.label3}>{C.row.cancelled}</span>
        ) : (
          <div className={styles.row5}>
            <button
              type="button"
              onClick={() => onConfirm(don)}
              disabled={busy}
              className={styles.button3}
            >
              {busy ? C.row.busy : C.row.confirm}
            </button>
            <button
              type="button"
              onClick={() => onCancel(don)}
              disabled={busy}
              className={styles.button4}
            >
              {C.row.cancel}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
