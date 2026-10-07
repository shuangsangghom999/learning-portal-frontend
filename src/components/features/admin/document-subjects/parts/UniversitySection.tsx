import { Check, GraduationCap, Pencil, Plus, Trash2, X } from "lucide-react";

import { ADMIN_DOCUMENT_SUBJECTS as C } from "@/src/constants/admin/document-subjects-page";
import type { DocumentUniversity } from "@/src/services/document";

import type { DocumentCatalogState } from "../hooks/useDocumentCatalog";
import styles from "../AdminDocumentSubjects.module.scss";

/** Truong dai hoc: them, doi ten / logo, xoa. */
export default function UniversitySection({ s }: { s: DocumentCatalogState }) {
  const U = C.universities;

  const phim = (t: DocumentUniversity) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") s.doiTenTruong(t);
    if (e.key === "Escape") s.setSuaTruong(null);
  };

  return (
    <>
      <h2 className={styles.muc}>
        <GraduationCap size={18} />
        {U.heading}
      </h2>
      <form onSubmit={s.themTruong} className={styles.them}>
        <input
          value={s.tenTruongMoi}
          onChange={(e) => s.setTenTruongMoi(e.target.value)}
          maxLength={U.maxLength}
          placeholder={U.placeholder}
          aria-label={U.nameAria}
          className={styles.o}
        />
        <button
          type="submit"
          disabled={!s.tenTruongMoi.trim()}
          className={styles.nutChinh}
        >
          <Plus size={15} />
          {U.add}
        </button>
      </form>
      {!s.dangTai && s.dsTruong.length > 0 && (
        <ul className={styles.ds}>
          {s.dsTruong.map((t) => (
            <li key={t._id} className={styles.dong1}>
              {s.suaTruong === t._id ? (
                <div className={styles.sua}>
                  <input
                    value={s.tenTruongSua}
                    onChange={(e) => s.setTenTruongSua(e.target.value)}
                    onKeyDown={phim(t)}
                    maxLength={U.maxLength}
                    autoFocus
                    aria-label={C.newNameAria(t.ten)}
                    className={styles.o}
                  />
                  <input
                    value={s.logoSua}
                    onChange={(e) => s.setLogoSua(e.target.value)}
                    onKeyDown={phim(t)}
                    maxLength={U.logoMaxLength}
                    placeholder={U.logoPlaceholder}
                    aria-label={U.logoAria(t.ten)}
                    className={styles.o}
                  />
                  <button
                    type="button"
                    onClick={() => s.doiTenTruong(t)}
                    className={styles.nutIcon}
                    aria-label={C.saveNameAria}
                  >
                    <Check size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => s.setSuaTruong(null)}
                    className={styles.nutIcon}
                    aria-label={C.cancelAria}
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <span className={styles.ten}>
                    {t.ten}
                    {t.logo && <span className={styles.coLogo}>{U.hasLogo}</span>}
                  </span>
                  <span className={styles.so}>{U.count(t.soTaiLieu)}</span>
                  <div className={styles.thaoTac}>
                    <button
                      type="button"
                      onClick={() => s.batDauSuaTruong(t)}
                      className={styles.nutIcon}
                      title={U.editTitle}
                      aria-label={C.renameAria(t.ten)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => s.xoaTruong(t)}
                      className={styles.nutXoa}
                      title={U.deleteTitle}
                      aria-label={C.deleteAria(t.ten)}
                    >
                      <Trash2 size={15} />
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
