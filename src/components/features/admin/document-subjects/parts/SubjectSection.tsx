import { BookOpen, Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

import { ADMIN_DOCUMENT_SUBJECTS as C } from "@/src/constants/admin/document-subjects-page";

import type { DocumentCatalogState } from "../hooks/useDocumentCatalog";
import styles from "../AdminDocumentSubjects.module.scss";

/** Mon hoc: them, doi ten, xep vao linh vuc, xoa (khi khong con tai lieu). */
export default function SubjectSection({ s }: { s: DocumentCatalogState }) {
  const S = C.subjects;

  return (
    <>
      <h2 className={styles.muc}>
        <BookOpen size={18} />
        {S.heading}
      </h2>
      <form onSubmit={s.them} className={styles.them}>
        <input
          value={s.tenMoi}
          onChange={(e) => s.setTenMoi(e.target.value)}
          maxLength={S.maxLength}
          placeholder={S.placeholder}
          aria-label={S.nameAria}
          className={styles.o}
        />
        <button
          type="submit"
          disabled={s.dangThem || !s.tenMoi.trim()}
          className={styles.nutChinh}
        >
          {s.dangThem ? (
            <Loader2 size={15} className={styles.quay} />
          ) : (
            <Plus size={15} />
          )}
          {S.add}
        </button>
      </form>

      {s.dangTai ? (
        <div className={styles.trong}>
          <Loader2 size={20} className={styles.quay} />
          {S.loading}
        </div>
      ) : s.ds.length === 0 ? (
        <div className={styles.trong}>
          <BookOpen size={22} />
          {S.empty}
        </div>
      ) : (
        <ul className={styles.ds}>
          {s.ds.map((m) => (
            <li key={m._id} className={styles.dong1}>
              {s.dangSua === m._id ? (
                <div className={styles.sua}>
                  <input
                    value={s.tenSua}
                    onChange={(e) => s.setTenSua(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") s.luuTen(m);
                      if (e.key === "Escape") s.setDangSua(null);
                    }}
                    maxLength={S.maxLength}
                    autoFocus
                    aria-label={C.newNameAria(m.ten)}
                    className={styles.o}
                  />
                  <button
                    type="button"
                    onClick={() => s.luuTen(m)}
                    disabled={s.dangLuu}
                    className={styles.nutIcon}
                    aria-label={C.saveNameAria}
                  >
                    {s.dangLuu ? (
                      <Loader2 size={15} className={styles.quay} />
                    ) : (
                      <Check size={15} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => s.setDangSua(null)}
                    className={styles.nutIcon}
                    aria-label={C.cancelAria}
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <span className={styles.ten}>{m.ten}</span>
                  <span className={styles.so}>{S.count(m.soTaiLieu)}</span>
                  <div className={styles.thaoTac}>
                    {/* Xep mon vao linh vuc - luu ngay khi chon. */}
                    <select
                      value={m.nhom ?? ""}
                      onChange={(e) => s.xepMon(m, e.target.value)}
                      aria-label={S.categoryAria(m.ten)}
                      className={`${styles.oChonNho} ${m.nhom ? "" : styles.chuaXep}`}
                    >
                      <option value="">{S.noCategory}</option>
                      {s.dsNhom.map((n) => (
                        <option key={n._id} value={n._id}>
                          {n.ten}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => s.batDauSuaMon(m)}
                      className={styles.nutIcon}
                      title={C.renameTitle}
                      aria-label={C.renameAria(m.ten)}
                    >
                      <Pencil size={15} />
                    </button>
                    {/* Mon con tai lieu thi khong xoa duoc - may chu cung chan
                        (409). Tat nut ngay tu dau va noi ly do ngay tren nut. */}
                    <button
                      type="button"
                      onClick={() => s.xoa(m)}
                      disabled={m.soTaiLieu > 0 || s.dangXoa === m._id}
                      className={styles.nutXoa}
                      title={m.soTaiLieu > 0 ? S.inUseTitle : S.deleteTitle}
                      aria-label={C.deleteAria(m.ten)}
                    >
                      {s.dangXoa === m._id ? (
                        <Loader2 size={15} className={styles.quay} />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
