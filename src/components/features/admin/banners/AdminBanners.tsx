"use client";

import { Image as ImageIcon, Loader2, Plus } from "lucide-react";

import { ADMIN_BANNERS as C } from "@/src/constants/admin-banners";

import { useAdminBanners } from "./hooks/useAdminBanners";
import BannerFormPanel from "./parts/BannerFormPanel";
import BannersTable from "./parts/BannersTable";
import styles from "./AdminBanners.module.scss";

/** Trang /admin/banners - tao va cau hinh banner quang cao. */
export default function AdminBanners() {
  const s = useAdminBanners();

  if (s.loading) {
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
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 className={styles.title}>{C.title}</h1>
            <p className={styles.text}>{C.intro}</p>
          </div>
        </div>
        {!s.showForm && (
          <button onClick={s.openForm} className={styles.button}>
            <Plus size={16} /> {C.add}
          </button>
        )}
      </div>

      {s.showForm && <BannerFormPanel s={s} />}

      <BannersTable s={s} />
    </div>
  );
}
