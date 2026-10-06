/** Chu va cau hinh cua trang /admin/coin (nap coin, tang khoa). */
export const ADMIN_COIN = {
  /** Cho bao lau sau lan go cuoi moi tim nguoi (ms). */
  searchDelay: 350,
  searchLimit: 20,
  noteMaxLength: 300,
  vndPerCoin: 1000,

  title: "Coin & Quà tặng",
  intro: "Nạp coin hoặc tặng thẳng khoá học cho học viên. 1 coin = 1.000đ.",

  picker: {
    placeholder: "Tìm theo tên hoặc email",
    searching: "Đang tìm…",
    noMatch: "Không có ai khớp.",
    avatarFallback: "?",
  },
  pickPrompt: "Chọn một học viên ở cột bên trái để xem ví và nạp coin.",

  wallet: {
    loading: "Đang đọc ví…",
    balance: "Số dư",
    coins: (n: string) => `${n} coin`,
    approx: (n: string) => `≈ ${n}đ`,
    totalTopup: "Tổng đã nạp",
    txCount: "Số giao dịch",
  },

  adjust: {
    heading: "Nạp / thu hồi coin",
    placeholder: "Ví dụ 500",
    add: "Cộng",
    addTail: "coin (≈",
    addEnd: "đ)",
    revoke: "Thu hồi",
    revokeTail: "coin",
    hint: "Nhập số nguyên. Số âm là thu hồi.",
    notePlaceholder: "Ghi chú (không bắt buộc)",
    submit: "Xác nhận",
  },

  gift: {
    heading: "Tặng khoá học",
    choose: "— Chọn khoá học —",
    priceInCoin: (coins: number) => ` (${coins} coin)`,
    free: " (miễn phí)",
    noteBefore: "Mở khoá thẳng, ",
    noteStrong: "không trừ coin",
    noteAfter: " của học viên.",
    submit: "Tặng khoá này",
  },

  busy: "Đang xử lý…",

  log: { heading: "Lịch sử giao dịch", empty: "Chưa có giao dịch nào." },

  messages: {
    walletFailed: "Không đọc được ví",
    topupFailed: "Không nạp được coin",
    giftFailed: "Không tặng được khoá",
  },
} as const;
