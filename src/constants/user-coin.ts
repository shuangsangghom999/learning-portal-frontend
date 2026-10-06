/** Chu va cau hinh cua trang /user/coin (nap coin). */
export const USER_COIN = {
  profileHref: "/user/profile",
  coursesHref: "/courses",
  // Cac muc nap goi san. Nguoi dung van go so tuy y duoc, nhung phan lon chon
  // mot muc co san nhanh hon go.
  packages: [100, 200, 500, 1000, 2000, 5000],
  defaultCoins: 500,
  /** Hoi may chu xem tien da ve chua, moi bao nhieu ms. */
  pollMs: 5000,

  disabled: {
    text: "Tính năng coin đang tạm ngưng. Khóa học có phí thanh toán bằng chuyển khoản qua mã QR.",
    back: "Về danh sách khóa học",
  },

  back: "Về hồ sơ của tôi",
  title: "Nạp coin",
  intro: (rate: string) =>
    `1 coin = ${rate}. Coin dùng để mở khóa học ngay, không phải chờ đối chiếu từng lần mua.`,
  balanceLabel: "Số dư hiện tại",
  coins: (n: string) => `${n} coin`,

  pending: {
    heading: (amount: string, coins: string) =>
      `Chuyển khoản ${amount} để nhận ${coins} coin`,
    qrAlt: (amount: string, code: string) =>
      `Mã QR chuyển khoản ${amount} nội dung ${code}`,
    qrHint: "Quét mã là mọi ô đã điền sẵn, không phải gõ tay.",
    bank: "Ngân hàng",
    accountNo: "Số tài khoản",
    accountName: "Tên tài khoản",
    amount: "Số tiền",
    content: "Nội dung",
    copyAccount: "số tài khoản",
    copyAmount: "số tiền",
    copyContent: "nội dung",
    noBank: {
      a: "Máy chủ chưa khai báo tài khoản nhận tiền nên chưa sinh được mã QR. Mã ",
      b: " vẫn hợp lệ — liên hệ ban quản trị để lấy thông tin chuyển khoản.",
    },
    mustInclude: {
      a: "Nội dung chuyển khoản ",
      strong: "bắt buộc",
      b: " là ",
      c: ". Ghi thiếu hoặc ghi sai thì ban quản trị không biết khoản tiền đó là của ai.",
    },
    reported:
      "Đã báo cho ban quản trị. Coin sẽ vào ví sau khi đối chiếu sao kê — bạn cứ để yên trang này, có coin là nó tự hiện.",
    mailFailed: {
      a: "Tuy nhiên mail báo chưa gửi được, nên bạn nhắn thêm cho ban quản trị kèm mã ",
      b: " cho chắc.",
    },
    sending: "Đang gửi...",
    iTransferred: "Tôi đã chuyển khoản",
    cancel: "Hủy yêu cầu",
    recheck: "Kiểm tra lại xem coin đã vào chưa",
  },

  picker: {
    heading: "Chọn số coin muốn nạp",
    other: "Hoặc nhập số coin khác",
    mustPay: "Phải chuyển: ",
    creating: "Đang tạo yêu cầu...",
    create: "Tạo yêu cầu nạp",
  },

  messages: {
    walletFailed: "Không đọc được thông tin ví",
    invalidCoins: "Số coin phải là số nguyên lớn hơn 0",
    createFailed: "Không tạo được yêu cầu nạp",
    cancelFailed: "Không hủy được yêu cầu",
    reportFailed: "Không gửi được thông báo",
  },
} as const;
