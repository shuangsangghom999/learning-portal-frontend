import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye, User } from "lucide-react";

import ArticleWithOutline from "@/src/components/common/ArticleWithOutline";
import { phutDoc, thoiGianTuongDoi } from "@/src/components/common/time";
import SafeImage from "@/src/components/ui/SafeImage";
import { BLOG } from "@/src/constants/blog";
import type { BlogPost } from "@/src/services/post";

import styles from "./BlogDetail.module.scss";

/** Trang /blog/[slug]: dau bai (anh, the, tac gia...) + noi dung co muc luc. */
export default function BlogDetail({ bai }: { bai: BlogPost }) {
  const D = BLOG.detail;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href={BLOG.listHref} className={styles.box}>
          <ArrowLeft size={16} />
          {D.back}
        </Link>

        <div className={styles.card}>
          {bai.thumbnail && (
            // aspect-[16/6] thay vi chieu cao co dinh: anh khong bi bop meo
            // tren man hinh hep, va khong tao khoang trong tren man hinh rong.
            <div className={styles.box2}>
              <SafeImage
                src={bai.thumbnail}
                alt={bai.title}
                fill
                sizes={D.imageSizes}
                className={styles.box3}
                priority
              />
            </div>
          )}

          <div className={styles.box4}>
            <div className={styles.row}>
              {bai.tags.map((t) => (
                <span key={t} className={styles.label}>
                  {t}
                </span>
              ))}
            </div>

            <h1 className={styles.title}>{bai.title}</h1>
            <p className={styles.text}>{bai.excerpt}</p>

            <div className={styles.row2}>
              <span className={styles.label2}>
                <User size={15} className={styles.box5} />
                {bai.author?.name || D.anonymous}
              </span>
              <span className={styles.label2}>
                <CalendarDays size={15} className={styles.box5} />
                {thoiGianTuongDoi(bai.createdAt)}
              </span>
              <span className={styles.label2}>
                <Eye size={15} className={styles.box5} />
                {D.views(bai.views)}
              </span>
              <span>{D.readMinutes(phutDoc(bai.content ?? ""))}</span>
            </div>
          </div>
        </div>

        <ArticleWithOutline content={bai.content ?? ""} goiYKhiTrong={D.noOutline} />
      </div>
    </div>
  );
}
