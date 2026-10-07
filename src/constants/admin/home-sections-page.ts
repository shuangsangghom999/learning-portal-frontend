/**
 * Ba trang ghim khoa hoc len trang chu cua admin:
 * /admin/home-most-popular, /admin/home-trending-now, /admin/home-new-releases.
 * Cung mot bo cuc, chi khac nguon du lieu, co ghim, cot so lieu va chu.
 */
export const ADMIN_HOME_SECTION_COMMON = {
  searchPlaceholder: "Tìm kiếm khóa học...",
  empty: "Không tìm thấy khóa học nào.",
  noImage: "https://placehold.co/150x100?text=No+Image",
  columns: {
    course: "Khóa học",
    instructor: "Giảng viên / Cấp độ",
    showOnHome: "Hiện Trang Chủ",
  },
  instructorFallback: (id: string) => `ID: ${id}`,
  students: "học viên",
  noDate: "N/A",
} as const;

export const ADMIN_HOME_SECTIONS = {
  popular: {
    loading: "Đang tải danh sách phổ biến...",
    title: "Most Popular Section",
    description:
      "Danh sách sắp xếp theo số lượng học viên giảm dần. Tích chọn để hiển thị ra trang chủ.",
    metricColumn: "Tổng Học viên",
    loadError: "Lỗi lấy danh sách khóa học phổ biến:",
    toggleFailed: "Cập nhật trạng thái ghim thất bại!",
  },
  trending: {
    loading: "Đang tải danh sách xu hướng...",
    title: "Trending Now Section",
    description:
      "Danh sách sắp xếp ưu tiên theo Khóa được ghim, Rating và số lượng học viên. Tích chọn để hiển thị ra trang chủ.",
    metricColumn: "Tổng Học viên",
    loadError: "Lỗi lấy danh sách khóa học xu hướng:",
    toggleFailed: "Cập nhật trạng thái ghim xu hướng thất bại!",
  },
  newReleases: {
    loading: "Đang tải danh sách mới phát hành...",
    title: "New Releases Section",
    description:
      "Danh sách sắp xếp theo thời gian khởi tạo mới nhất. Tích chọn để hiển thị ép buộc lên đầu mục ngoài trang chủ.",
    metricColumn: "Ngày Tạo",
    loadError: "Lỗi lấy danh sách khóa học mới phát hành:",
    toggleFailed: "Cập nhật trạng thái ghim mới phát hành thất bại!",
  },
} as const;

export type AdminHomeSectionKind = keyof typeof ADMIN_HOME_SECTIONS;
