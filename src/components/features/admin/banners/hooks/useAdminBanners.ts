"use client";

import { useEffect, useState } from "react";

import { ADMIN_BANNERS as C } from "@/src/constants/admin/banners-page";
import { apiRequest } from "@/src/services/apiHelper";
import { bannerService, BannerData } from "@/src/services/banner";

/** Du lieu bieu mau banner (tao / sua). */
export interface BannerForm {
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  backgroundColor: string;
  textColor: string;
  displayType: BannerData["displayType"];
  discountText: string;
  discountSubtext: string;
  page: BannerData["page"];
  order: number;
}

const FORM_MAC_DINH: BannerForm = {
  title: "",
  description: "",
  buttonText: "Explore",
  linkUrl: "",
  backgroundColor: "#0056d2",
  textColor: "#ffffff",
  displayType: "DEFAULT",
  discountText: "",
  discountSubtext: "",
  page: "HOME",
  order: 0,
};

/** Danh sach banner + bieu mau tao / sua (kem anh Cloudinary) + xoa. */
export function useAdminBanners() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(FORM_MAC_DINH);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /** Doi mot truong cua bieu mau. */
  const set = <K extends keyof BannerForm>(key: K, value: BannerForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function fetchAllBanners() {
    try {
      const json = await apiRequest(C.endpoint, {
        method: "GET",
        cache: "no-store",
      });
      if (json.success) setBanners(json.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tất cả banner:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Goi qua mot vong microtask thay vi goi thang. Ham tai du lieu bat dau
    // bang setLoading(true), nen goi thang la setState dong bo ngay trong than
    // effect: React phai chay them mot vong ve lai truoc khi hien man hinh
    // (rule react-hooks/set-state-in-effect canh bao dung cho nay). Hoan mot
    // vong microtask thi mat thuong khong thay khac, ma vong ve thua het.
    void Promise.resolve().then(fetchAllBanners);
  }, []);

  const handleEditClick = (banner: BannerData) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      linkUrl: banner.linkUrl || "",
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor,
      displayType: banner.displayType,
      discountText: banner.discountText || "",
      discountSubtext: banner.discountSubtext || "",
      page: banner.page,
      order: banner.order || 0,
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setForm(FORM_MAC_DINH);
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("buttonText", form.buttonText);
      formData.append("linkUrl", form.linkUrl);
      formData.append("backgroundColor", form.backgroundColor);
      formData.append("textColor", form.textColor);
      formData.append("displayType", form.displayType);
      formData.append("page", form.page);
      formData.append("order", String(form.order));

      // Banner moi tao luon o trang thai bat
      if (!editingId) {
        formData.append("isActive", "true");
      }

      if (form.displayType === "DISCOUNT") {
        formData.append("discountText", form.discountText);
        formData.append("discountSubtext", form.discountSubtext);
      }
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editingId) {
        await bannerService.updateBanner(editingId, formData);
      } else {
        await bannerService.createBanner(formData);
      }

      handleResetForm();
      fetchAllBanners();
    } catch {
      alert(C.messages.saveFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(C.messages.confirmDelete)) return;
    try {
      await bannerService.deleteBanner(id);
      fetchAllBanners();
    } catch {
      alert(C.messages.deleteFailed);
    }
  };

  return {
    banners,
    loading,
    submitting,
    showForm,
    openForm: () => setShowForm(true),
    editingId,
    form,
    set,
    setSelectedFile,
    handleEditClick,
    handleResetForm,
    handleSubmit,
    handleDelete,
  };
}

export type AdminBannersState = ReturnType<typeof useAdminBanners>;
