import { Check, Layers, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

import { BIEU_TUONG } from "@/src/components/features/portal/share-document/parts/DocumentCategories";
import { ADMIN_DOCUMENT_SUBJECTS as C } from "@/src/constants/admin/document-subjects-page";
import type { BieuTuongLinhVuc } from "@/src/services/document";

import type { DocumentCatalogState } from "../hooks/useDocumentCatalog";
import styles from "../AdminDocumentSubjects.module.scss";

const DS_BIEU_TUONG = Object.entries(BIEU_TUONG) as [
  BieuTuongLinhVuc,
  (typeof BIEU_TUONG)[BieuTuongLinhVuc],
][];

function BieuTuongOptions() {
  return (
    <>
      {DS_BIEU_TUONG.map(([k, v]) => (
        <option key={k} value={k}>
          {v.nhan}
        </option>
      ))}
    </>
  );
}

/** Linh vuc: them (ten + bieu tuong), doi ten, doi bieu tuong, xoa. */
export default function CategorySection({ s }: { s: DocumentCatalogState }) {
  const K = C.categories;

  return (
    <>
      <h2 className={styles.muc}>
        <Layers size={18} />
        {K.heading}
      </h2>
      <form onSubmit={s.themNhom} className={styles.them}>
        <input
          value={s.tenNhomMoi}
          onChange={(e) => s.setTenNhomMoi(e.target.value)}
          maxLength={K.maxLength}
          placeholder={K.placeholder}
          aria-label={K.nameAria}
          className={styles.o}
        />
        <select
          value={s.bieuTuongMoi}
          onChange={(e) => s.setBieuTuongMoi(e.target.value as BieuTuongLinhVuc)}
          aria-label={K.iconAria}
          className={styles.oChon}
        >
          <BieuTuongOptions />
        </select>
        <button
          type="submit"
          disabled={s.dangThemNhom || !s.tenNhomMoi.trim()}
          className={styles.nutChinh}
        >
          {s.dangThemNhom ? (
            <Loader2 size={15} className={styles.quay} />
          ) : (
            <Plus size={15} />
          )}
          {K.add}
        </button>
      </form>

      {!s.dangTai && s.dsNhom.length > 0 && (
        <ul className={styles.ds}>
          {s.dsNhom.map((n) => {
            const bt = BIEU_TUONG[n.bieuTuong] ?? BIEU_TUONG.sach;
            return (
              <li key={n._id} className={styles.dong1}>
                <span className={styles.bieuTuong} aria-hidden>
                  <bt.Icon size={16} />
                </span>
                {s.suaNhom === n._id ? (
                  <div className={styles.sua}>
                    <input
                      value={s.tenNhomSua}
                      onChange={(e) => s.setTenNhomSua(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") s.capNhatNhom(n, { ten: s.tenNhomSua });
                        if (e.key === "Escape") s.setSuaNhom(null);
                      }}
                      maxLength={K.maxLength}
                      autoFocus
                      aria-label={C.newNameAria(n.ten)}
                      className={styles.o}
                    />
                    <button
                      type="button"
                      onClick={() => s.capNhatNhom(n, { ten: s.tenNhomSua })}
                      className={styles.nutIcon}
                      aria-label={C.saveNameAria}
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => s.setSuaNhom(null)}
                      className={styles.nutIcon}
                      aria-label={C.cancelAria}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={styles.ten}>{n.ten}</span>
                    <span className={styles.so}>{K.count(n.soMon, n.soTaiLieu)}</span>
                    <div className={styles.thaoTac}>
                      <select
                        value={n.bieuTuong}
                        onChange={(e) =>
                          s.capNhatNhom(n, {
                            bieuTuong: e.target.value as BieuTuongLinhVuc,
                          })
                        }
                        aria-label={K.iconOfAria(n.ten)}
                        className={styles.oChonNho}
                      >
                        <BieuTuongOptions />
                      </select>
                      <button
                        type="button"
                        onClick={() => s.batDauSuaNhom(n)}
                        className={styles.nutIcon}
                        title={C.renameTitle}
                        aria-label={C.renameAria(n.ten)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => s.xoaNhom(n)}
                        className={styles.nutXoa}
                        title={K.deleteTitle}
                        aria-label={C.deleteAria(n.ten)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
