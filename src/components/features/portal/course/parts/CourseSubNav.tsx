"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import SafeImage from "@/src/components/ui/SafeImage";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";

import styles from "../CoursePage.module.scss";

/**
 * Thanh tab dinh kieu Coursera. Tab sang theo muc dang doc (scroll spy); khi
 * nut o hero da cuon khuat (`compact`) thi hien them hang ten khoa + nut.
 */
export default function CourseSubNav({
  tabs,
  compact,
  title,
  logo,
  cta,
}: {
  tabs: readonly { id: string; label: string }[];
  compact: boolean;
  title: string;
  logo?: string;
  cta: ReactNode;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(tabs[0]?.id);
  const [stuck, setStuck] = useState(false);
  const ids = tabs.map((t) => t.id).join(",");

  useEffect(() => {
    const list = ids.split(",");
    const onScroll = () => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      // top cua thanh = chieu cao header (--site-header-h, xem Header.tsx).
      setStuck(rect.top <= parseFloat(getComputedStyle(bar).top) + 0.5);

      // Muc dang doc = muc cuoi cung da chui qua mep duoi thanh tab (tinh ca
      // hang ten khoa neu dang hien).
      const line =
        (bar.firstElementChild?.getBoundingClientRect().bottom ?? rect.bottom) + 24;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={barRef} className={styles.tabsBar}>
      <div className={`${styles.tabsInner} ${stuck ? styles.tabsBarStuck : ""}`}>
        <div className={styles.container}>
          {/* Chi hien khi thanh da dinh duoi header: hien som hon (thanh con
            nam giua trang) thi hang nay de len tieu de muc ngay ben duoi. */}
          {compact && stuck && (
            <div className={styles.compact}>
              {logo && (
                <span className={styles.compactLogo}>
                  <SafeImage src={logo} alt="" fill sizes="32px" />
                </span>
              )}
              <span className={styles.compactTitle}>{title}</span>
              {cta}
            </div>
          )}

          <nav aria-label={C.tabsLabel} className={styles.tabs}>
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={go(tab.id)}
                aria-current={active === tab.id ? "true" : undefined}
                className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
