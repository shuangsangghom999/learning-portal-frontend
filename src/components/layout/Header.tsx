"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import TopNav from "./TopNav";
import IndividualsHeader from "./headers/IndividualsHeader";
import BlogHeader from "./headers/BlogHeader";
import ShareDocumentHeader from "./headers/ShareDocumentHeader";
import GpaHeader from "./headers/GpaHeader";

import styles from "./Header.module.scss";
// Cac cong cu diem va trang luyen tap dung chung mot header de dieu huong qua
// lai giua chung. Phai khop danh sach TOOLS trong headers/GpaHeader.tsx.
const GPA_ROUTES = ["/gpa-calculator", "/calc-point", "/convert-10-to-4", "/practice"];

export default function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Header co dinh (position: fixed). Ghi chieu cao that vao --site-header-h
  // de thanh dinh ben duoi (vd tab trang khoa hoc) bam ngay duoi no - chieu
  // cao doi theo man hinh va theo loai header.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() =>
      root.style.setProperty("--site-header-h", `${el.offsetHeight}px`),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const renderHeader = () => {
    if (pathname.startsWith("/blog")) return <BlogHeader />;
    if (pathname.startsWith("/share-document")) return <ShareDocumentHeader />;
    if (GPA_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
      return <GpaHeader />;
    }
    return <IndividualsHeader />;
  };

  return (
    <header ref={ref} className={styles.header}>
      <TopNav />
      {renderHeader()}
    </header>
  );
}
