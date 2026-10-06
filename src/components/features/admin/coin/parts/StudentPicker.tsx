import { Search } from "lucide-react";

import { ADMIN_COIN as C } from "@/src/constants/admin-coin";
import type { User } from "@/src/services/userApi";

import styles from "../AdminCoin.module.scss";

interface StudentPickerProps {
  tuKhoa: string;
  onTuKhoa: (v: string) => void;
  dangTim: boolean;
  dsNguoi: User[];
  chonId: string | undefined;
  onChon: (u: User) => void;
}

/** Cot trai: o tim + danh sach hoc vien de chon. */
export default function StudentPicker({
  tuKhoa,
  onTuKhoa,
  dangTim,
  dsNguoi,
  chonId,
  onChon,
}: StudentPickerProps) {
  return (
    <div className={styles.card}>
      <div className={styles.box2}>
        <div className={styles.box3}>
          <Search size={16} className={styles.floating} />
          <input
            value={tuKhoa}
            onChange={(e) => onTuKhoa(e.target.value)}
            placeholder={C.picker.placeholder}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.scroller}>
        {dangTim && dsNguoi.length === 0 ? (
          <p className={styles.text2}>{C.picker.searching}</p>
        ) : dsNguoi.length === 0 ? (
          <p className={styles.text2}>{C.picker.noMatch}</p>
        ) : (
          dsNguoi.map((u) => (
            <button
              key={u._id}
              onClick={() => onChon(u)}
              className={`${styles.button4} ${chonId === u._id ? styles.button : ""}`}
            >
              <span className={styles.grid2}>
                {u.name?.[0]?.toUpperCase() ?? C.picker.avatarFallback}
              </span>
              <span className={styles.label}>
                <span className={styles.label2}>{u.name}</span>
                <span className={styles.label3}>{u.email}</span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
