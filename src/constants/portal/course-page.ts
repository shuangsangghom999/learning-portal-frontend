/** Chu cua trang gioi thieu khoa hoc /course?slug=... (phia hoc vien). */
export const COURSE_PAGE = {
  homeHref: "/",
  cartHref: "/cart",
  learnHref: (slug: string) => `/learn?slug=${slug}`,
  paymentHref: (code: string) => `/payment?code=${code}`,
  /** id cua khu mua o hero - nut o thanh tab dinh cuon ve day. */
  buyAnchorId: "mua-khoa-hoc",
  /** Moi lan tai (va moi lan bam "Xem them danh gia") lay ngan nay danh gia. */
  reviewsQuery: { limit: 3, sortBy: "newest" as const },
  /** Tien do toi thieu (%) moi duoc viet danh gia. */
  reviewMinProgress: 25,
  suggestionsCount: 4,

  notFound: {
    title: "Không tìm thấy dữ liệu",
    text: "Khóa học không tồn tại hoặc chưa được xuất bản.",
    home: "Quay về trang chủ",
  },

  instructorFallback: "Giảng viên",

  breadcrumb: {
    label: "Đường dẫn trang",
    home: "Trang chủ",
    courses: "Khóa học",
    coursesHref: "/courses",
  },

  hero: {
    instructor: "Giảng viên:",
    enter: "Vào học tiếp",
    processing: "Đang xử lý…",
    buy: (price: string) => `Mua khóa học · ${price}`,
    freeEnroll: "Đăng ký học miễn phí",
    /** {n} in dam, phan con lai la chu thuong. */
    enrolled: "học viên đã đăng ký",
    accessFree: "Miễn phí, học không giới hạn thời gian",
    accessPaid: (days: number) => `Học trong ${days} ngày kể từ khi thanh toán`,
    renew: "Gia hạn khóa học",
    addToCart: "Thêm vào giỏ",
    inCart: "Đã có trong giỏ",
    expired: (date: string) => `Khóa học đã hết hạn ngày ${date}. Mua lại để học tiếp.`,
  },

  /** The 4 thong so de len mep duoi hero (kieu Coursera). */
  keyInfo: {
    lessons: (n: number) => `${n} bài học`,
    lessonsLink: "Xem chương trình học",
    noLessons: "Đang soạn bài",
    noLessonsSub: "Chương trình sẽ sớm được cập nhật",
    reviews: (n: number) => `(${n} đánh giá)`,
    noReviews: "Chưa có đánh giá",
    noReviewsSub: (p: number) => `Học được ${p}% là viết đánh giá được`,
    level: (label: string) => `Cấp độ ${label}`,
    levelFallback: "Mọi trình độ",
    levelSub: {
      beginner: "Phù hợp người mới bắt đầu",
      intermediate: "Cần nắm kiến thức nền tảng",
      advanced: "Dành cho người đã có kinh nghiệm",
    } as Record<string, string>,
    levelSubFallback: "Ai cũng học được",
    accessFree: "Học trọn đời",
    accessFreeSub: "Theo tốc độ của bạn",
    accessPaid: (days: number) => `${days} ngày học`,
    accessPaidSub: "Tính từ khi thanh toán",
  },

  tabs: [
    { id: "about", label: "Tổng quan" },
    { id: "outcomes", label: "Kết quả đạt được" },
    { id: "curriculum", label: "Chi tiết khóa học" },
    { id: "faqs", label: "Câu hỏi thường gặp" },
    { id: "reviews", label: "Đánh giá" },
  ],
  tabsLabel: "Mục của trang khóa học",

  about: {
    learnHeading: "Bạn sẽ học những gì",
    /** So bai hien o "Ban se hoc nhung gi" - day du nam o Chuong trinh hoc. */
    learnCount: 6,
    learnMore: (n: number) => `Và ${n} bài học khác`,
    topicsHeading: "Chủ đề của khóa học",
    detailsHeading: "Thông tin cần biết",
    details: {
      certificate: "Chứng nhận hoàn thành",
      certificateSub: "Kèm mã tra cứu để xác thực",
      providerSub: {
        university: "Trường học cung cấp nội dung",
        company: "Doanh nghiệp cung cấp nội dung",
      } as Record<string, string>,
      online: "Học trực tuyến",
      onlineSub: "Không cần cài đặt, mở trình duyệt là học",
      /** {d} = thang/nam. */
      updated: (d: string) => `Cập nhật ${d}`,
      updatedSub: "Nội dung được giảng viên duy trì",
    },
  },

  /** Dai banner don vi dao tao (kieu "thin banner" cua Coursera). */
  partners: {
    heading: "Học cùng các trường và doanh nghiệp đối tác",
    /** {n} = so don vi co logo. */
    sub: "{n} đơn vị đào tạo đang cung cấp khóa học trên hệ thống.",
    link: "Khám phá tất cả khóa học",
    href: "/courses",
    maxLogos: 6,
  },

  /** Muc "Ket qua dat duoc" (kieu Outcomes cua Coursera). */
  outcomes: {
    heading: (n: number) => `Học, luyện tập và nhận chứng nhận qua ${n} bài học`,
    headingNoLessons: "Học, luyện tập và nhận chứng nhận hoàn thành",
    by: (teacher: string) => `Học theo lộ trình cùng giảng viên ${teacher}`,
    byProvider: (teacher: string, unit: string) =>
      `Học theo lộ trình cùng giảng viên ${teacher} của ${unit}`,
    progress: "Hệ thống lưu tiến độ từng bài, quay lại là học tiếp đúng chỗ đã dừng",
    certificate: "Học xong nhận chứng nhận hoàn thành, kèm mã tra cứu để xác thực",
    certKind: "Learning Platform",
    certName: "Chứng nhận hoàn thành",
    certCode: "Mã tra cứu: ••••••••",
    certCaption: "Mẫu chứng nhận bạn nhận được khi hoàn thành khóa học",
  },

  /** Muc "Chi tiet khoa hoc" (kieu Project details cua Coursera). */
  details: {
    aboutHeading: "Giới thiệu khóa học",
    aboutEmpty: "Giảng viên chưa viết phần giới thiệu cho khóa học này.",
    more: "Xem thêm",
    less: "Thu gọn",
    stepsHeading: "Học từng bước",
    stepsIntro: (n: number) =>
      `Khóa học gồm ${n} bài, học lần lượt theo thứ tự dưới đây:`,
    stepsEmpty: "Nội dung bài học đang được xây dựng.",
    video: "Video",
    document: "Tài liệu",
    levelHeading: "Trình độ khuyến nghị",
    instructorHeading: "Giảng viên",
    /** Diem trung binh cac khoa cua giang vien (co trong so). */
    instructorRating: "Điểm các khóa",
    ratings: (n: number) => `(${n.toLocaleString("vi-VN")} đánh giá)`,
    courses: (n: number) => `${n.toLocaleString("vi-VN")} khóa học`,
    learners: (n: number) => `${n.toLocaleString("vi-VN")} học viên`,
    providerHeading: "Đơn vị cung cấp",
    providerType: {
      university: "Trường học",
      company: "Doanh nghiệp",
    } as Record<string, string>,
  },

  faqs: {
    heading: "Câu hỏi thường gặp",
    loading: "Đang tải câu hỏi…",
  },

  reviews: {
    heading: "Đánh giá của học viên",
    count: (n: number) => `${n.toLocaleString("vi-VN")} đánh giá`,
    stars: (n: number) => `${n} sao`,
    /** Nhan cho trinh doc man hinh. */
    ratedAria: (r: number, n: number) => `${r} trên 5 sao, ${n} đánh giá`,
    reviewAria: (r: number) => `Chấm ${r} trên 5 sao`,
    showing: (a: number, b: number) => `Đang hiển thị ${a} / ${b} đánh giá`,
    reviewedOn: (d: string) => `Đánh giá ngày ${d}`,
    more: "Xem thêm đánh giá",
    loadingMore: "Đang tải…",
    noReviews: "Chưa có đánh giá",
    emptyHint: (p: number) =>
      `Khóa học này chưa có đánh giá nào. Học viên học được ${p}% khóa học là viết được đánh giá.`,
    anonymous: "Học viên",
    formTitle: (p: number) => `Chia sẻ trải nghiệm học của bạn (Tiến độ: ${p}%)`,
    placeholder:
      "Nội dung kiến thức có sát với thực chiến không? Hãy đánh giá trung thực để cải thiện hệ thống nhé...",
    sending: "Đang gửi đi...",
    submit: "Đăng tải phản hồi",
    locked: {
      a: "🔒 Bạn cần tích lũy học tập tối thiểu ",
      strong: (p: number) => `${p}%`,
      b: " tổng thời lượng khóa học để mở khóa tính năng viết bình luận.",
    },
    currentProgress: (p: number) => `Tiến trình lớp học hiện tại của bạn: ${p}%`,
    loading: "Đang tải đánh giá…",
    helpful: (n: number) => `Hữu ích (${n})`,
    verified: "Học viên của khóa",
    empty: "Khóa học này hiện chưa nhận được phản hồi.",
  },

  messages: {
    loadFailed: "Không thể tải thông tin chi tiết khóa học",
    missingId: "Không tìm thấy thông tin định danh khóa học",
    loginToContinue: "Vui lòng đăng nhập để tiếp tục chương trình học",
    enrollFailed: "Không thể xử lý ghi danh. Vui lòng thử lại!",
    genericError: "Đã xảy ra lỗi",
    emptyReview: "Vui lòng nhập phản hồi!",
    reviewSent: "Gửi phản hồi thành công!",
    reviewFailed: "Gặp sự cố khi gửi",
  },
} as const;
