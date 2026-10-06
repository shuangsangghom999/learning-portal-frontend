import type { DonHang, KhoaHocTrongDon } from "@/src/services/order";

/** Moi khoa trong don: don gio hang doc `courses`, don mua le chi co `course`. */
export const khoaTrongDon = (don: DonHang): KhoaHocTrongDon[] =>
  don.courses?.length ? don.courses : don.course ? [don.course] : [];
