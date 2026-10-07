import { ADMIN_VOUCHERS as C } from "@/src/constants/admin/vouchers-page";

import type { AdminVouchersState } from "../hooks/useAdminVouchers";
import styles from "../AdminVouchers.module.scss";

const tien = (n: number) => n.toLocaleString("vi-VN");

/** Hop xem ai da dung ma va tong so tien da giam. Bam nen de dong. */
export default function UsageModal({ s }: { s: AdminVouchersState }) {
  const U = C.usage;
  const { luot } = s;

  return (
    <div className={styles.overlay} onClick={s.dongLuot}>
      <div className={styles.box3} onClick={(e) => e.stopPropagation()}>
        <div className={styles.row6}>
          <h2 className={styles.text3}>{U.title}</h2>
          <button type="button" onClick={s.dongLuot} className={styles.button7}>
            {U.close}
          </button>
        </div>

        {!luot && <p className={styles.text5}>{U.loading}</p>}

        {luot && luot.danhSach.length === 0 && <p className={styles.text5}>{U.empty}</p>}

        {luot && luot.danhSach.length > 0 && (
          <>
            <p className={styles.text6}>
              {U.totalLabel}{" "}
              <strong className={styles.strong}>{tien(luot.tongGiam)}đ</strong>
            </p>
            <div className={styles.scroller}>
              {luot.danhSach.map((l) => (
                <div key={l._id} className={styles.row7}>
                  <div className={styles.box4}>
                    <p className={styles.text7}>
                      {l.user?.name || l.user?.email || U.deletedUser}
                    </p>
                    <p className={styles.text8}>{l.course?.title || U.none}</p>
                  </div>
                  <span className={styles.label9}>{U.discount(tien(l.soTienGiam))}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
