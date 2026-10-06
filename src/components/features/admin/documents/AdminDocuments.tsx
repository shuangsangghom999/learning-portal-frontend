"use client";

import { FileText, Loader2 } from "lucide-react";

import { ADMIN_DOCUMENTS as C } from "@/src/constants/admin-documents";

import { useAdminDocuments } from "./hooks/useAdminDocuments";
import DeleteDocumentDialog from "./parts/DeleteDocumentDialog";
import DocumentRow from "./parts/DocumentRow";
import DocumentsToolbar from "./parts/DocumentsToolbar";
import styles from "./AdminDocuments.module.scss";

/** Trang /admin/documents - toan bo tai lieu nguoi dung chia se. */
export default function AdminDocuments() {
  const s = useAdminDocuments();
  const K = C.columns;

  return (
    <div className={styles.page}>
      <DocumentsToolbar s={s} />

      {s.dangTai ? (
        <div className={styles.trong}>
          <Loader2 size={22} className={styles.quay} />
          {C.loading}
        </div>
      ) : s.danhSach.length === 0 ? (
        <div className={styles.trong}>
          <FileText size={22} />
          {s.tuKhoa ? C.emptyFiltered(s.tuKhoa) : C.empty}
        </div>
      ) : (
        <div className={styles.bangBoc}>
          <table className={styles.bang}>
            <thead>
              <tr>
                <th>{K.doc}</th>
                <th>{K.subjects}</th>
                <th>{K.uploader}</th>
                <th>{K.date}</th>
                <th className={styles.phai}>{K.downloads}</th>
                <th className={styles.phai}>{K.actions}</th>
              </tr>
            </thead>
            <tbody>
              {s.danhSach.map((d) => (
                <DocumentRow key={d._id} d={d} s={s} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {s.tongTrang > 1 && (
        <div className={styles.phanTrang}>
          <button
            type="button"
            onClick={() => s.setTrang((t) => Math.max(1, t - 1))}
            disabled={s.trang <= 1}
            className={styles.nutTrang}
          >
            {C.pager.prev}
          </button>
          <span className={styles.soTrang}>{C.pager.info(s.trang, s.tongTrang)}</span>
          <button
            type="button"
            onClick={() => s.setTrang((t) => Math.min(s.tongTrang, t + 1))}
            disabled={s.trang >= s.tongTrang}
            className={styles.nutTrang}
          >
            {C.pager.next}
          </button>
        </div>
      )}

      <DeleteDocumentDialog s={s} />
    </div>
  );
}
