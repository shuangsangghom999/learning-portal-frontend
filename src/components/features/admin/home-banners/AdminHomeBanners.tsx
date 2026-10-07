"use client";

import { Loader2, Search, SlidersHorizontal } from "lucide-react";

import { ADMIN_HOME_BANNERS as C } from "@/src/constants/admin/home-banners-page";

import { useHomeBanners } from "./hooks/useHomeBanners";
import HomeBannerRow from "./parts/HomeBannerRow";
import styles from "./AdminHomeBanners.module.scss";

/** Trang /admin/home-banners - bat/tat nhanh banner o trang chu. */
export default function AdminHomeBanners() {
  const b = useHomeBanners();

  if (b.loading) {
    return (
      <div className={styles.row}>
        <Loader2 className={styles.spinner} size={24} /> {C.loading}
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <div className={styles.card}>
        <div className={styles.row2}>
          <div className={styles.box}>
            <SlidersHorizontal size={24} />
          </div>
          <div>
            <h1 className={styles.title}>{C.title}</h1>
            <p className={styles.text}>{C.description}</p>
          </div>
        </div>
        <div className={styles.box2}>
          <Search className={styles.floating} size={18} />
          <input
            type="text"
            placeholder={C.searchPlaceholder}
            value={b.searchTerm}
            onChange={(e) => b.setSearchTerm(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.card2}>
        {b.filteredBanners.length === 0 ? (
          <div className={styles.box3}>{C.empty}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles.row3}>
                <th className={styles.headCell}>{C.columns.content}</th>
                <th className={styles.headCell}>{C.columns.type}</th>
                <th className={styles.headCell2}>{C.columns.order}</th>
                <th className={styles.headCell2}>{C.columns.active}</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {b.filteredBanners.map((banner) => (
                <HomeBannerRow
                  key={banner._id}
                  banner={banner}
                  updating={b.updatingId === banner._id}
                  onToggle={b.handleToggleActive}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
