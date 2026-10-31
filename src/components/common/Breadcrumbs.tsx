import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

import styles from "./Breadcrumbs.module.scss";

export interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  /** Cac chang SAU trang chu (trang chu luon la icon ngoi nha dau tien). */
  items: Crumb[];
  homeHref?: string;
  homeLabel?: string;
  label?: string;
}

/**
 * Dai breadcrumb kieu Coursera: nen trang, cao 44px, nam ngay duoi header va
 * tren hero. Do rong noi dung theo bien --crumbs-max (mac dinh 1400px, bang
 * .container cua trang khoa hoc).
 */
export default function Breadcrumbs({
  items,
  homeHref = "/",
  homeLabel = "Trang chủ",
  label = "Breadcrumb",
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={styles.bar}>
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href={homeHref} aria-label={homeLabel} className={styles.home}>
            <House size={18} aria-hidden />
          </Link>
        </li>
        {items.map((c) => (
          <li key={c.href} className={styles.item}>
            <ChevronRight size={18} aria-hidden className={styles.sep} />
            <Link href={c.href} className={styles.link}>
              {c.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
