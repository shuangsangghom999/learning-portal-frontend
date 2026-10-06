"use client";

import { useEffect, useState } from "react";

import { ADMIN_HOME_BANNERS as C } from "@/src/constants/admin-home-banners";
import { apiRequest } from "@/src/services/apiHelper";
import { bannerService, BannerData } from "@/src/services/banner";

/** Banner vi tri HOME (ca dang an), tim theo tieu de, bat/tat hien thi. */
export function useHomeBanners() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomeBanners() {
      try {
        const json = await apiRequest(C.endpoint, {
          method: "GET",
          cache: "no-store",
        });

        if (json.success && Array.isArray(json.data)) {
          // Chi giu banner cau hinh cho vi tri "HOME", du dang an hay hien.
          const homeBanners = (json.data as BannerData[]).filter(
            (b) => b.page === C.page,
          );
          setBanners(homeBanners);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách banner trang chủ:", error);
      } finally {
        setLoading(false);
      }
    }

    // Goi qua mot vong microtask thay vi goi thang. Ham tai du lieu bat dau
    // bang setLoading(true), nen goi thang la setState dong bo ngay trong than
    // effect: React phai chay them mot vong ve lai truoc khi hien man hinh
    // (rule react-hooks/set-state-in-effect canh bao dung cho nay). Hoan mot
    // vong microtask thi mat thuong khong thay khac, ma vong ve thua het.
    void Promise.resolve().then(fetchHomeBanners);
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingId(id);

      // Gui FormData chi co isActive len API PUT
      const formData = new FormData();
      formData.append("isActive", String(!currentStatus));

      await bannerService.updateBanner(id, formData);

      // Doi state tai cho de giao dien cap nhat ngay
      setBanners((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isActive: !currentStatus } : b)),
      );
    } catch {
      alert(C.toggleFailed);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBanners = banners.filter((b) =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    loading,
    searchTerm,
    setSearchTerm,
    updatingId,
    filteredBanners,
    handleToggleActive,
  };
}
