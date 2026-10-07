import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { CART } from "@/src/constants/portal/cart-page";

import styles from "../Cart.module.scss";

/** Gio trong: chua them gi, hoac vua mua xong het. */
export default function EmptyCart({ xong }: { xong: boolean }) {
  const E = CART.empty;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ShoppingCart size={36} className={styles.box} />
        <h1 className={styles.title}>{E.title}</h1>

        {xong ? (
          <p className={styles.text}>{E.bought}</p>
        ) : (
          <p className={styles.text}>{E.nothing}</p>
        )}

        <div className={styles.row}>
          <Link href={CART.coursesHref} className={styles.box2}>
            {E.findCourses}
          </Link>
          {xong && (
            <Link href={CART.myCoursesHref} className={styles.card}>
              {E.myCourses}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
