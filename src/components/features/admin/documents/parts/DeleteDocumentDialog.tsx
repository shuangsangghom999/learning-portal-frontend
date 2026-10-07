import { ADMIN_DOCUMENTS as C } from "@/src/constants/admin/documents-page";

import type { AdminDocumentsState } from "../hooks/useAdminDocuments";
import styles from "../AdminDocuments.module.scss";

/**
 * Hoi lai truoc khi xoa. Xoa tai lieu la KHONG LAY LAI DUOC: ban ghi mat
 * va file tren Cloudinary cung bi go (xem deleteDocument).
 */
export default function DeleteDocumentDialog({ s }: { s: AdminDocumentsState }) {
  const D = C.deleteDialog;
  if (!s.hoiXoa) return null;

  return (
    <div
      className={styles.lopPhu}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tieu-de-xoa"
    >
      <div className={styles.hopThoai}>
        <h2 id="tieu-de-xoa" className={styles.hopTieuDe}>
          {D.title}
        </h2>
        <p className={styles.hopChu}>
          <strong>{s.hoiXoa.title}</strong>
          {D.body}
        </p>
        <div className={styles.hopNut}>
          <button
            type="button"
            onClick={() => s.setHoiXoa(null)}
            className={styles.nutHuy}
          >
            {D.cancel}
          </button>
          <button
            type="button"
            onClick={s.xacNhanXoa}
            disabled={s.dangXoa !== null}
            className={styles.nutXacNhan}
          >
            {s.dangXoa ? D.deleting : D.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
