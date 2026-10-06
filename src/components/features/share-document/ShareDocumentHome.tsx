import DocumentCategories from "@/src/components/document/DocumentCategories";
import DocumentExplore from "@/src/components/document/DocumentExplore";
import DocumentShowcase from "@/src/components/document/DocumentShowcase";
import DocumentStats from "@/src/components/document/DocumentStats";
import DocumentUniversities from "@/src/components/document/DocumentUniversities";
import ShareDocumentIndex from "@/src/components/document/ShareDocumentIndex";
import FaqSection from "@/src/components/home/FaqSection";

import { layDuLieuTrangTaiLieu } from "./data";
import styles from "./ShareDocumentHome.module.scss";

/**
 * Trang CHU cua khu tai lieu: dai dau (tha file / tim), roi cac section.
 * Danh sach tat ca tai lieu nam o /share-document/all-document.
 */
export default async function ShareDocumentHome() {
  const d = await layDuLieuTrangTaiLieu();

  return (
    <div className={styles.page}>
      <ShareDocumentIndex dsMon={d.dsMon} />
      <DocumentShowcase dsMuc={d.dsTrinhBay} />
      <DocumentExplore dsTab={d.dsTabKhamPha} />
      {d.thongKe && <DocumentStats tk={d.thongKe} />}
      <DocumentUniversities dsTruong={d.dsTruong} dsTaiLieu={d.moiNhat} />
      <DocumentCategories dsNhom={d.dsNhom} />
      {/* Cuoi trang: FAQ rieng cua khu tai lieu (admin: /admin/faqs, tab
          "Chia se tai lieu"). Loi mang thi truyen null de component tu goi lai. */}
      <FaqSection viTri="taiLieu" initialData={d.faqs} />
    </div>
  );
}
