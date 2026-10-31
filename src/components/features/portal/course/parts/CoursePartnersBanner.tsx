"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import SafeImage from "@/src/components/ui/SafeImage";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { fillTemplate } from "@/src/lib/format";
import { getProviders, type ProviderData } from "@/src/services/provider";

import styles from "../CoursePage.module.scss";

const P = C.partners;

/**
 * Dai banner mong kieu Coursera ("See how employees at top companies..."):
 * mot cau + link ben trai, logo cac don vi dao tao ben phai. Logo lay tu
 * /api/providers; khong co don vi nao co logo thi an ca dai.
 */
export default function CoursePartnersBanner() {
  const [units, setUnits] = useState<ProviderData[]>([]);

  useEffect(() => {
    let alive = true;
    getProviders()
      .then((list) => {
        if (alive && Array.isArray(list)) setUnits(list.filter((u) => u.logo));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (units.length === 0) return null;
  const shown = units.slice(0, P.maxLogos);

  return (
    <section className={styles.partners} aria-labelledby="course-partners-heading">
      <div className={styles.partnersText}>
        <h2 id="course-partners-heading" className={styles.partnersHeading}>
          {P.heading}
        </h2>
        <p className={styles.partnersSub}>{fillTemplate(P.sub, { n: units.length })}</p>
        <Link href={P.href} className={styles.partnersLink}>
          {P.link}
        </Link>
      </div>

      <ul className={styles.partnersLogos}>
        {shown.map((u) => (
          <li key={u._id ?? u.slug} title={u.name}>
            <SafeImage src={u.logo} alt={u.name} fill sizes="140px" />
          </li>
        ))}
      </ul>
    </section>
  );
}
