import { AlertCircle, CheckCircle, Download, FileText, Search, X } from "lucide-react";

import { ADMIN_DOCUMENTS as C } from "@/src/constants/admin-documents";

import type { AdminDocumentsState } from "../hooks/useAdminDocuments";
import styles from "../AdminDocuments.module.scss";

/** Tieu de + so lieu, o tim, thong bao loi / thanh cong. */
export default function DocumentsToolbar({ s }: { s: AdminDocumentsState }) {
  return (
    <>
      <header className={styles.top}>
        <div>
          <h1 className={styles.title}>{C.title}</h1>
          <p className={styles.sub}>{C.subtitle}</p>
        </div>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <FileText size={15} />
            {C.stats.total(s.tong)}
          </span>
          {/* Noi ro "trang nay": con so chi cong tu 20 dong dang hien, khong
              phai tong ca kho. Ghi tron "luot tai" la mot con so sai. */}
          <span className={styles.stat}>
            <Download size={15} />
            {C.stats.downloads(s.tongLuotTai)}
          </span>
          {/* Chi hien khi co: day la viec admin can lam, khong phai so lieu. */}
          {s.soChuaCoMon > 0 && (
            <span className={`${styles.stat} ${styles.statCanh}`}>
              <AlertCircle size={15} />
              {C.stats.noSubject(s.soChuaCoMon)}
            </span>
          )}
        </div>
      </header>

      <form onSubmit={s.timKiem} className={styles.timKhung}>
        <Search size={16} className={styles.timIcon} />
        <input
          value={s.oTim}
          onChange={(e) => s.setOTim(e.target.value)}
          placeholder={C.search.placeholder}
          className={styles.timInput}
        />
        {s.tuKhoa && (
          <button
            type="button"
            onClick={s.xoaTim}
            className={styles.timXoa}
            aria-label={C.search.clearAria}
          >
            <X size={15} />
          </button>
        )}
        <button type="submit" className={styles.timNut}>
          {C.search.submit}
        </button>
      </form>

      {s.loi && (
        <div className={styles.bangLoi}>
          <AlertCircle size={16} />
          {s.loi}
        </div>
      )}
      {s.baoThanhCong && (
        <div className={styles.bangOk}>
          <CheckCircle size={16} />
          {s.baoThanhCong}
          <button
            type="button"
            onClick={s.dongBao}
            aria-label={C.closeAria}
            className={styles.dong}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
