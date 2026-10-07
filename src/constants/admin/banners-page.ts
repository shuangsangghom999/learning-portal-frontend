import type { BannerData } from "@/src/services/banner";

/** Chu va cau hinh cua trang /admin/banners. */
export const ADMIN_BANNERS = {
  endpoint: "/banners?page=HOME&admin=true",

  loading: "Đang tải hệ thống dữ liệu Banner...",
  title: "Banners Management",
  intro:
    "Khởi tạo các khối banner quảng cáo và cấu hình đồ họa, đẩy file ảnh trực tiếp lên kho chứa Cloudinary.",
  add: "Thêm Mới Banner",

  form: {
    createTitle: "Tạo Khung Quảng Cáo Mới",
    editTitle: "Cập Nhật Thông Tin Banner",
    title: "Tiêu đề Banner *",
    buttonText: "Chữ trên nút bấm",
    page: "Vị trí Trang hiển thị *",
    pages: [
      { value: "HOME", label: "HOME (Trang Chủ)" },
      { value: "COURSE_LIST", label: "COURSE_LIST (Trang Khóa Học)" },
      { value: "PRODUCT_LIST", label: "PRODUCT_LIST (Trang Sản Phẩm)" },
      { value: "CART", label: "CART (Trang Giỏ Hàng)" },
    ] satisfies { value: BannerData["page"]; label: string }[],
    link: "Đường dẫn liên kết khi click nút (URL Link)",
    linkPlaceholder: "Ví dụ: /courses/nextjs-basic hoặc https://google.com",
    description: "Mô tả chi tiết banner *",
    background: "Màu Nền (Mã Hex)",
    textColor: "Màu Chữ (Mã Hex)",
    order: "Độ ưu tiên (Order)",
    displayType: "Kiểu họa hình hiển thị",
    displayTypes: [
      { value: "DEFAULT", label: "DEFAULT (Chỉ có chữ)" },
      { value: "IMAGE", label: "IMAGE (Upload File ảnh đại diện)" },
      { value: "DISCOUNT", label: "DISCOUNT (Hộp số giảm giá %)" },
    ] satisfies { value: BannerData["displayType"]; label: string }[],
    discountText: "Text số giảm giá (Ví dụ: 40% hoặc $10)",
    discountSubtext: "Text phụ dưới số (Ví dụ: OFF hoặc GIẢM)",
    image: "Chọn file ảnh Upload lên Cloudinary",
    cancel: "Hủy",
    save: "Lưu Thiết Cấu Hình",
  },

  table: {
    columns: ["Thông tin Banner", "Vị trí hiển thị", "Cấu trúc đồ họa", "Thao Tác"],
    link: (url: string) => `Link: ${url}`,
    disabled: "ĐÃ TẮT",
    editTitle: "Sửa nội dung",
    deleteTitle: "Xóa vĩnh viễn",
  },

  messages: {
    saveFailed: "Xử lý form banner thất bại!",
    confirmDelete:
      "Bạn có chắc chắn muốn xóa vĩnh viễn banner này khỏi DB và Cloudinary không?",
    deleteFailed: "Xóa banner thất bại!",
  },
} as const;
