"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { COLLECTIONS } from "@/src/constants/collection";
import { getHomeSections, type Course } from "@/src/services/course";

/** Doc ?slug= va tai danh sach khoa cua muc tuong ung tu du lieu trang chu. */
export function useCourseCollection() {
  // Lay slug tu query string: /collection?slug=most-popular-courses
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get("slug") || "";
  const muc = COLLECTIONS[collectionSlug];

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setLoading(true);
        const response = await getHomeSections();
        const dinhNghia = COLLECTIONS[collectionSlug];

        if (response?.success && response.data && dinhNghia) {
          setCourses(response.data[dinhNghia.lay] || []);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bộ sưu tập khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [collectionSlug]);

  return { muc, courses, loading };
}
