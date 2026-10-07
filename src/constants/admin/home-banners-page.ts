/** Chu cua trang /admin/home-banners (bat/tat banner trang chu). */
export const ADMIN_HOME_BANNERS = {
  /** Lay ca banner dang an (admin=true) cua vi tri HOME. */
  endpoint: "/banners?page=HOME&admin=true",
  page: "HOME",

  loading: "Đang tải cấu hình hiển thị banner...",
  title: "Homepage Banners",
  description:
    "Bật hoặc tắt nhanh trạng thái hiển thị của các Khung quảng cáo (Banner) hiển thị tại Trang Chủ Client.",
  searchPlaceholder: "Tìm kiếm tiêu đề banner...",
  empty: "Không tìm thấy bản ghi banner nào của HOME.",

  columns: {
    content: "Nội dung Banner",
    type: "Phân Loại / Vị Trí",
    order: "Thứ tự ưu tiên",
    active: "Trạng Thái Kích Hoạt",
  },
  discountFallback: "%",
  pageLabel: (page: string) => `Trang: ${page}`,
  orderLabel: (order: string) => `Sắp xếp: ${order}`,
  orderValue: (order: number | undefined) => "Thứ tự " + order,

  toggleFailed: "Cập nhật trạng thái hiển thị thất bại!",
} as const;
