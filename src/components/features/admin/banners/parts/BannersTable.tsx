import { Edit2, Link2, Trash2 } from "lucide-react";

import { ADMIN_BANNERS as C } from "@/src/constants/admin-banners";

import type { AdminBannersState } from "../hooks/useAdminBanners";
import styles from "../AdminBanners.module.scss";

/** Bang banner: xem truoc mau + nut, vi tri, kieu hien thi, sua / xoa. */
export default function BannersTable({ s }: { s: AdminBannersState }) {
  const T = C.table;

  return (
    <div className={styles.card4}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.row6}>
            {T.columns.map((col, i) => (
              <th
                key={col}
                className={
                  i === T.columns.length - 1 ? styles.headCell2 : styles.headCell
                }
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {s.banners.map((b) => (
            <tr key={b._id} className={styles.row7}>
              <td className={styles.headCell}>
                <div className={styles.row2}>
                  <div
                    style={{ backgroundColor: b.backgroundColor, color: b.textColor }}
                    className={styles.col}
                  >
                    <span>{b.buttonText}</span>
                  </div>
                  <div>
                    <span className={styles.label}>{b.title}</span>
                    <p className={styles.text2}>{b.description}</p>
                    {/* Hien nho link duoi tieu de de admin de quan sat */}
                    {b.linkUrl && (
                      <p className={styles.text3}>
                        <Link2 size={10} /> {T.link(b.linkUrl)}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className={styles.cell}>{b.page}</td>
              <td className={styles.headCell}>
                <span className={styles.card5}>{b.displayType}</span>
                {!b.isActive && <span className={styles.card6}>{T.disabled}</span>}
              </td>
              <td className={styles.headCell}>
                <div className={styles.row8}>
                  <button
                    onClick={() => s.handleEditClick(b)}
                    className={styles.button5}
                    title={T.editTitle}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => s.handleDelete(b._id)}
                    className={styles.button6}
                    title={T.deleteTitle}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
