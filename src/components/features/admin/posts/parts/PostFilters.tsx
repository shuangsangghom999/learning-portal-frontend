import { Search } from "lucide-react";

import { ADMIN_POSTS as C, type PostStatusFilter } from "@/src/constants/admin-posts";

import type { AdminPostsState } from "../hooks/useAdminPosts";
import styles from "../AdminPosts.module.scss";

/** O tim tieu de, loc trang thai, loc chu de va dem so bai. */
export default function PostFilters({ s }: { s: AdminPostsState }) {
  const F = C.filters;

  return (
    <div className={styles.card2}>
      <form onSubmit={s.timKiem} className={styles.form}>
        <div className={styles.box2}>
          <Search size={16} className={styles.floating} />
          <input
            value={s.tuKhoa}
            onChange={(e) => s.setTuKhoa(e.target.value)}
            placeholder={F.searchPlaceholder}
            aria-label={F.searchAria}
            className={`${styles.card8} ${styles.input}`}
          />
        </div>
        <button type="submit" className={styles.button}>
          {F.search}
        </button>
      </form>

      <select
        value={s.trangThai}
        onChange={(e) => s.doiTrangThai(e.target.value as PostStatusFilter)}
        aria-label={F.statusAria}
        className={styles.card8}
      >
        {F.statuses.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={s.chuDe}
        onChange={(e) => s.doiChuDe(e.target.value)}
        aria-label={F.topicAria}
        className={styles.card8}
      >
        <option value="">{F.allTopics}</option>
        {s.topics.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>

      <span className={styles.label}>
        {F.count(s.tong)}
        {s.tuKhoaDangDung && F.matching(s.tuKhoaDangDung)}
      </span>
    </div>
  );
}
