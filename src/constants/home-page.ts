/** Cau hinh trang chu (app/(portal)/page.tsx). */
export const HOME_PAGE = {
  api: {
    categories: "/api/categories",
    providers: "/api/providers",
    faqs: "/api/faqs/homepage",
    homeSections: "/api/courses/home-sections",
    courses: "/api/courses",
  },
  /** So khoa goi y ca nhan hoa hien tren trang chu. */
  suggestionsCount: 8,
} as const;
