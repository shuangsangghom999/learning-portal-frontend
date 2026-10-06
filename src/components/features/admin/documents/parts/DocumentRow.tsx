import Link from "next/link";
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { duongTaiLieu } from "@/src/components/document/duongDan";
import {
  doiKichThuoc,
  nhanDinhDang,
  tongDungLuong,
} from "@/src/components/document/fileInfo";
import SubjectPicker from "@/src/components/document/SubjectPicker";
import { ADMIN_DOCUMENTS as C } from "@/src/constants/admin-documents";
import type { SharedDocument } from "@/src/services/document";

import type { AdminDocumentsState } from "../hooks/useAdminDocuments";
import styles from "../AdminDocuments.module.scss";

/** Mot tai lieu: ten + dinh dang, mon (sua tai cho), nguoi dang, ngay, thao tac. */
export default function DocumentRow({
  d,
  s,
}: {
  d: SharedDocument;
  s: AdminDocumentsState;
}) {
  const R = C.row;
  const dangSuaMon = s.dangSuaMon === d._id;
  const dangDoiAn = s.dangDoiAn === d._id;
  const dangXoa = s.dangXoa === d._id;

  return (
    <tr className={d.daAn ? styles.dongAn : undefined}>
      <td>
        {/* Tai lieu da an: trang chi tiet tra 404 voi moi nguoi, ke
            ca admin (trang do dung san o may chu, khong mang cookie
            admin) - nen khong de duong dan toi mot trang loi. Admin
            van mo duoc FILE bang nut ben phai. */}
        {d.daAn ? (
          <span className={styles.tenTaiLieu}>{d.title}</span>
        ) : (
          <Link href={duongTaiLieu(d._id)} target="_blank" className={styles.tenTaiLieu}>
            {d.title}
          </Link>
        )}
        <span className={styles.meta}>
          {d.daAn && <span className={styles.nhanAn}>{R.hidden}</span>}
          {nhanDinhDang(d.files)} &middot; {doiKichThuoc(tongDungLuong(d.files))}
        </span>
      </td>
      <td>
        {dangSuaMon ? (
          <div className={styles.suaMonNhieu}>
            <SubjectPicker dsMon={s.dsMon} chon={s.giaTriMon} doiChon={s.setGiaTriMon} />
            <div className={styles.suaMon}>
              <button
                type="button"
                onClick={() => s.luuMon(d)}
                disabled={s.dangLuuMon}
                className={styles.nutLuu}
                aria-label={R.saveSubjectsAria}
              >
                {s.dangLuuMon ? (
                  <Loader2 size={14} className={styles.quay} />
                ) : (
                  <Check size={14} />
                )}
              </button>
              <button
                type="button"
                onClick={s.huySuaMon}
                className={styles.nutPhu}
                aria-label={R.cancelSubjectsAria}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => s.batDauSuaMon(d)}
            className={d.monHoc?.length ? styles.mon : styles.monTrong}
            title={R.editSubjectsTitle}
          >
            {d.monHoc?.length ? d.monHoc.join(", ") : R.noSubject}
            <Pencil size={12} />
          </button>
        )}
      </td>
      <td>{d.uploader?.name || R.deletedUser}</td>
      <td>{new Date(d.createdAt).toLocaleDateString("vi-VN")}</td>
      <td className={styles.phai}>{d.downloadCount}</td>
      <td className={styles.phai}>
        <div className={styles.thaoTac}>
          {/* Mo file that, khong phai trang chi tiet: admin can xem
              NOI DUNG de quyet dinh go hay giu. */}
          <a
            href={C.fileHref(d._id)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nutPhu}
            title={R.openFileTitle}
            aria-label={R.openFileAria(d.title)}
          >
            <ExternalLink size={15} />
          </a>
          {/* An truoc, xoa sau: an la go khoi mat nguoi dung ma
              van lay lai duoc, xoa thi mat han ca file. */}
          <button
            type="button"
            onClick={() => s.doiAn(d)}
            disabled={dangDoiAn}
            className={styles.nutPhu}
            title={d.daAn ? R.showTitle : R.hideTitle}
            aria-label={R.toggleAria(Boolean(d.daAn), d.title)}
          >
            {dangDoiAn ? (
              <Loader2 size={15} className={styles.quay} />
            ) : d.daAn ? (
              <Eye size={15} />
            ) : (
              <EyeOff size={15} />
            )}
          </button>
          <button
            type="button"
            onClick={() => s.setHoiXoa(d)}
            disabled={dangXoa}
            className={styles.nutXoa}
            title={R.deleteTitle}
            aria-label={R.deleteAria(d.title)}
          >
            {dangXoa ? (
              <Loader2 size={15} className={styles.quay} />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
