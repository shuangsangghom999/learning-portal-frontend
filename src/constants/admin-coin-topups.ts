import type { TrangThaiNap } from "@/src/services/coin.api";

/** Chu va cau hinh cua trang /admin/coin-topups (yeu cau nap coin). */
export const ADMIN_COIN_TOPUPS = {
  pageSize: 10,

  title: "Yêu cầu nạp coin",
  intro:
    "Mở sao kê ngân hàng, tìm khoản tiền có nội dung trùng mã rồi mới xác nhận. Học viên bấm “tôi đã chuyển khoản” chỉ là lời khai, không phải bằng chứng.",

  /** Thu tu cac nut loc; "" = tat ca. */
  filters: ["pending", "paid", "cancelled", "expired", ""] as const,
  allLabel: "Tất cả",
  statusLabel: {
    pending: "Đang chờ",
    paid: "Đã cộng coin",
    cancelled: "Đã hủy",
    expired: "Quá hạn",
  } satisfies Record<TrangThaiNap, string>,

  columns: [
    "Học viên",
    "Mã / Nội dung CK",
    "Số coin",
    "Số tiền",
    "Báo đã chuyển",
    "Trạng thái",
  ],
  empty: "Không có yêu cầu nào.",

  row: {
    deleted: "(đã xóa)",
    none: "--",
    notReported: "chưa báo",
    confirmTitle: "Đã thấy tiền trong sao kê — cộng coin",
    cancelTitle: "Hủy yêu cầu",
  },

  messages: {
    loadFailed: "Không đọc được danh sách yêu cầu nạp",
    studentFallback: "học viên",
    confirm: (amount: string, code: string, coins: string, student: string) =>
      `Đã thấy ${amount}đ với nội dung "${code}" trong sao kê?\n\n` +
      `Xác nhận sẽ cộng ${coins} coin cho ${student}.`,
    confirmFailed: "Không xác nhận được yêu cầu",
    cancelReason: "Lý do hủy (để trống cũng được):",
    cancelFailed: "Không hủy được yêu cầu",
  },
} as const;
