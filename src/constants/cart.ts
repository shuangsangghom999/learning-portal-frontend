/** Chu cua trang /cart (gio hang). */
export const CART = {
  coursesHref: "/courses",
  myCoursesHref: "/user/my-courses",
  paymentHref: (code: string) => `/payment?code=${code}`,

  empty: {
    title: "Giỏ hàng trống",
    bought: "Đã mua xong. Vào mục khóa học của bạn để bắt đầu học.",
    nothing: "Bạn chưa thêm khóa học nào vào giỏ.",
    findCourses: "Tìm khóa học",
    myCourses: "Khóa học của tôi",
  },

  title: (n: number) => `Giỏ hàng (${n})`,

  item: {
    coins: (n: string) => `(${n} coin)`,
    unlocked: "Đã mở khóa",
    failed: "Không mua được",
    buying: "Đang mua…",
    removeAria: (title: string) => `Bỏ ${title} khỏi giỏ`,
  },
  clearAll: "Xóa hết giỏ hàng",

  summary: {
    heading: "Thanh toán",
    subtotal: "Tạm tính",
    total: "Tổng tiền",
    voucher: "Mã giảm giá",
    inCoins: "Quy ra coin",
    loginHint: "Đăng nhập để thanh toán. Giỏ hàng của bạn được giữ nguyên.",
    login: "Đăng nhập",
    creatingOrder: "Đang tạo đơn…",
    payQr: "Thanh toán qua mã QR ngân hàng",
    wallet: "Ví của bạn",
    walletLoading: "…",
    coins: (n: string) => `${n} coin`,
    missing: (n: string) => `Thiếu ${n} coin.`,
    buying: "Đang mua…",
    payCoin: "Thanh toán bằng coin",
    qrNote:
      "Cả giỏ hàng thanh toán bằng một lần chuyển khoản. Quét mã QR ở bước sau, khóa học tự mở khi tiền về tài khoản, thường chỉ sau vài phút.",
    toMyCourses: "Tới khóa học của tôi",
  },
} as const;
