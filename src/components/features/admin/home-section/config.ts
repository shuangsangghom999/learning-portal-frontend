import { Award, CalendarDays, Flame, type LucideIcon } from "lucide-react";

import type { AdminHomeSectionKind } from "@/src/constants/admin-home-sections";
import {
  getAdminNewReleasesCourses,
  getAdminPopularCourses,
  getAdminTrendingCourses,
  type Course,
} from "@/src/services/course";

import styles from "./AdminHomeSection.module.scss";

/** Co ghim tren khoa hoc ung voi tung muc trang chu. */
export type HomeTag = "isPopular" | "isTrending" | "isNewRelease";

interface SectionConfig {
  fetch: () => Promise<Course[]>;
  tag: HomeTag;
  icon: LucideIcon;
  /** Lop scss bo sung (de mau) cho o bieu tuong / nut bat / cot so lieu. */
  boxClass: string;
  buttonClass: string;
  cellClass: string;
  /** Cot so lieu: so hoc vien hay ngay tao. */
  metric: "students" | "createdAt";
}

export const SECTION_CONFIG: Record<AdminHomeSectionKind, SectionConfig> = {
  popular: {
    fetch: getAdminPopularCourses,
    tag: "isPopular",
    icon: Award,
    boxClass: "",
    buttonClass: "",
    cellClass: "",
    metric: "students",
  },
  trending: {
    fetch: getAdminTrendingCourses,
    tag: "isTrending",
    icon: Flame,
    boxClass: styles.boxTrending,
    buttonClass: styles.buttonTrending,
    cellClass: "",
    metric: "students",
  },
  newReleases: {
    fetch: getAdminNewReleasesCourses,
    tag: "isNewRelease",
    icon: CalendarDays,
    boxClass: styles.boxNewReleases,
    buttonClass: styles.buttonNewReleases,
    cellClass: styles.cellMuted,
    metric: "createdAt",
  },
};
