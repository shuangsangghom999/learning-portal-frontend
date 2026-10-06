"use client";

import { useEffect, useState } from "react";

import {
  ADMIN_HOME_SECTIONS,
  type AdminHomeSectionKind,
} from "@/src/constants/admin-home-sections";
import { updateCourseTags, type Course } from "@/src/services/course";

import { SECTION_CONFIG } from "../config";

/** Danh sach khoa hoc cua mot muc trang chu, tim kiem va bat/tat ghim. */
export function useAdminHomeSection(kind: AdminHomeSectionKind) {
  const cfg = SECTION_CONFIG[kind];
  const text = ADMIN_HOME_SECTIONS[kind];

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await cfg.fetch();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(text.loadError, error);
      } finally {
        setLoading(false);
      }
    }

    // Goi qua mot vong microtask thay vi goi thang. Ham tai du lieu bat dau
    // bang setLoading(true), nen goi thang la setState dong bo ngay trong than
    // effect: React phai chay them mot vong ve lai truoc khi hien man hinh
    // (rule react-hooks/set-state-in-effect canh bao dung cho nay). Hoan mot
    // vong microtask thi mat thuong khong thay khac, ma vong ve thua het.
    void Promise.resolve().then(fetchCourses);
  }, [cfg, text]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingId(id);
      await updateCourseTags(id, { [cfg.tag]: !currentStatus });
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, [cfg.tag]: !currentStatus } : c)),
      );
    } catch {
      alert(text.toggleFailed);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    loading,
    searchTerm,
    setSearchTerm,
    updatingId,
    filteredCourses,
    handleToggle,
  };
}
