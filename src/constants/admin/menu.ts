import {
  Award as AwardIcon,
  Award,
  BadgePercent,
  Bell,
  BookOpen,
  Building2,
  ClipboardList,
  Coins,
  FileText,
  Flame,
  FolderOpen,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Library,
  MessageSquare,
  Newspaper,
  PlusCircle,
  Receipt,
  SlidersHorizontal,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

import { HIEN_COIN } from "@/src/services/tinhNang";

export interface AdminSubMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Muc chi hien khi dang o trang con (vd. dang soan bai hoc). */
  isIndicatorOnly?: boolean;
  /** Cac duong dan lam muc nay sang. Mac dinh: chi dung href. */
  activeRoutes?: string[];
}

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isHomeSectionGroup?: boolean;
  submenu?: AdminSubMenuItem[];
  // Muc phang mac dinh sang khi pathname trung khop chinh xac href. Trang nao
  // co them man hinh soan thao rieng thi liet ke o day de van sang khi dang soan.
  matchRoutes?: string[];
}

// ===== NHOM ROUTE PHANG (URL khong con long nhau) =====
export const COURSE_ROUTES = [
  "/admin/courses",
  "/admin/course-create",
  "/admin/course-detail",
  "/admin/course-faqs",
  "/admin/categories",
  "/admin/category-create",
  "/admin/providers",
];

export const LESSON_ROUTES = [
  "/admin/lessons",
  "/admin/lesson-create",
  "/admin/lesson-detail",
  "/admin/quiz-create",
  "/admin/quiz-edit",
];

export const POST_ROUTES = ["/admin/posts", "/admin/post-create"];

export const HOME_SECTION_ROUTES = [
  "/admin/home-most-popular",
  "/admin/home-trending-now",
  "/admin/home-new-releases",
  "/admin/home-banners",
];

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Courses Management",
    href: "/admin/courses",
    icon: BookOpen,
    submenu: [
      {
        label: "All Courses",
        href: "/admin/courses",
        icon: BookOpen,
        activeRoutes: ["/admin/courses", "/admin/course-detail", "/admin/course-faqs"],
      },
      { label: "Create Course", href: "/admin/course-create", icon: PlusCircle },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderOpen,
        activeRoutes: ["/admin/categories", "/admin/category-create"],
      },
      { label: "Providers", href: "/admin/providers", icon: Building2 },
      {
        label: "Lesson Content",
        href: "",
        icon: Video,
        isIndicatorOnly: true,
        activeRoutes: LESSON_ROUTES,
      },
    ],
  },
  { label: "Banners Management", href: "/admin/banners", icon: ImageIcon },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  {
    label: "Home Sections",
    href: "/admin/home-most-popular",
    icon: LayoutGrid,
    isHomeSectionGroup: true,
    submenu: [
      { label: "Most Popular", href: "/admin/home-most-popular", icon: Award },
      { label: "Trending Now", href: "/admin/home-trending-now", icon: Flame },
      { label: "New Releases", href: "/admin/home-new-releases", icon: Sparkles },
      {
        label: "Homepage Banners",
        href: "/admin/home-banners",
        icon: SlidersHorizontal,
      },
    ],
  },
  // Dat canh Orders va Coin vi ba cai cung mot mach viec: tien vao he thong
  // bang duong nao, va duoc giam bao nhieu.
  { label: "Mã giảm giá", href: "/admin/vouchers", icon: BadgePercent },
  { label: "Thông báo hệ thống", href: "/admin/notifications", icon: Bell },
  // Coin dang tam an (services/tinhNang.ts). Hai trang van con nguyen, go thang
  // dia chi van vao duoc - chi bo khoi menu.
  ...(HIEN_COIN
    ? [
        { label: "Coin & Quà tặng", href: "/admin/coin", icon: Coins },
        { label: "Yêu cầu nạp coin", href: "/admin/coin-topups", icon: Coins },
      ]
    : []),
  { label: "Enrollments", href: "/admin/enrollments", icon: ClipboardList },
  { label: "Certificates", href: "/admin/certificates", icon: AwardIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reviews Management", href: "/admin/reviews", icon: MessageSquare },
  {
    label: "Blog Posts",
    href: "/admin/posts",
    icon: Newspaper,
    matchRoutes: POST_ROUTES,
  },
  { label: "Tài liệu chia sẻ", href: "/admin/documents", icon: FileText },
  // Rieng cho kho tai lieu - khong phai "Categories" cua khoa hoc o tren.
  { label: "Môn học tài liệu", href: "/admin/document-subjects", icon: Library },
  { label: "Homepage FAQs", href: "/admin/faqs", icon: HelpCircle },
];

/** Chu tren khung quan tri. */
export const ADMIN_SHELL = {
  dashboardHref: "/admin/dashboard",
  loading: "Loading Admin Panel...",
  brand: "ADMIN PAGE",
  groupFeatures: "Theme Features",
  groupComponents: "Components List",
  editingSuffix: "(Editing)",
  adminFallback: "Administrator",
  adminRole: "Super Admin",
  logoutTitle: "Sign out of system",
  home: "Home",
} as const;
