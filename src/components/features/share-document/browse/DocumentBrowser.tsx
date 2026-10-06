import type { ComponentProps } from "react";

import ShareDocumentClient from "@/src/components/document/ShareDocumentClient";

import styles from "./DocumentBrowser.module.scss";

/**
 * Khung danh sach tai lieu co bo loc - dung chung cho trang tat ca tai lieu va
 * trang linh vuc cua mot truong (hai trang chi khac bo loc dat san).
 */
export default function DocumentBrowser(
  props: ComponentProps<typeof ShareDocumentClient>,
) {
  const loc = props.boLocBanDau;

  return (
    <div className={styles.page}>
      {/* key theo bo loc: bam link sang bo loc khac (vd. tu trang chu khu tai
          lieu) thi client dung lai tu dau voi du lieu moi, khong giu state cu. */}
      <ShareDocumentClient
        key={`${loc.q}|${loc.mon}|${loc.nhom}|${loc.truong}|${loc.loai}`}
        {...props}
      />
    </div>
  );
}
