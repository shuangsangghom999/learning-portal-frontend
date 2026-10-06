"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useDangTaiNguoiDung, useNguoiDungLuu } from "@/src/hooks/userStore";
import { xoaPhien } from "@/src/services/apiHelper";

/** Gac cong quan tri, trang thai mo cac nhom menu va dang xuat. */
export function useAdminShell() {
  const router = useRouter();
  const pathname = usePathname();

  // Doc localStorage bang useSyncExternalStore thay vi useEffect + setState,
  // xem src/hooks/userStore.ts. Effect ben duoi chi con lo viec chuyen huong.
  const nguoiDung = useNguoiDungLuu();
  const dangTaiNguoiDung = useDangTaiNguoiDung();
  const adminName = nguoiDung?.name ?? "";

  // `loading` SUY RA duoc, khong can state rieng: con dang hoi may chu, hoac
  // sai vai tro va dang bi day ra. Giu state rieng thi phai setLoading() ngay
  // trong effect - React canh bao vi no de sinh vong ve lai day chuyen, va
  // eslint o day chay voi --max-warnings 0.
  const loading = dangTaiNguoiDung || nguoiDung?.role !== "admin";

  // null = "chua bam gi, cu theo duong dan"; true/false = nguoi dung da tu bam.
  //
  // Truoc day hai o nay la boolean thuong, mo ra bang mot useEffect chay theo
  // pathname - tuc la React ve mot lan voi menu dong roi ve lai voi menu mo.
  // Suy ra ngay luc ve thi khong con vong thua nao.
  const [menuKhoaTuBam, setMenuKhoaTuBam] = useState<boolean | null>(null);
  const [menuTrangChuTuBam, setMenuTrangChuTuBam] = useState<boolean | null>(null);

  // Tu dong mo nhom menu theo duong dan tren thanh dia chi
  const oKhuTrangChu = pathname.startsWith("/admin/home-most-popular");
  const oKhuKhoaHoc =
    (pathname.startsWith("/admin/courses") && !oKhuTrangChu) ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/providers") ||
    pathname.startsWith("/admin/lessons");

  // Chuyen SANG mot trang thuoc khu do thi bo lua chon tu bam, cho menu mo lai.
  // Chuyen sang trang khac thi giu nguyen y nguoi dung - dung y het hanh vi cua
  // useEffect cu, chi khac la khong ton mot vong ve lai.
  const [duongDanCu, setDuongDanCu] = useState(pathname);
  if (duongDanCu !== pathname) {
    setDuongDanCu(pathname);
    if (oKhuKhoaHoc) setMenuKhoaTuBam(null);
    if (oKhuTrangChu) setMenuTrangChuTuBam(null);
  }

  const isCourseMenuOpen = menuKhoaTuBam ?? oKhuKhoaHoc;
  const isHomeMenuOpen = menuTrangChuTuBam ?? oKhuTrangChu;

  // Gac cong khu quan tri bang cau tra loi cua MAY CHU.
  //
  // Ban cu doc localStorage.userInfo roi so user.role. Bat ky ai mo DevTools
  // cung sua duoc dong do thanh "admin": khong lay them duoc du lieu nao - moi
  // API van di qua middleware ben backend va van tra 403 - nhung TOAN BO khung
  // quan tri hien ra: menu, ten tung trang, breadcrumb. Do la ro ri be mat he
  // thong, va man hinh thi day loi 403 lon xon.
  //
  // Cung khong the sua bang cach doi sang luu token trong localStorage: trinh
  // duyet khong co JWT_SECRET nen KHONG kiem duoc chu ky, van phai tin phan
  // payload nguoi dung tu go ra - y het van de cu, lai them nguy co XSS doc
  // trom token (xem ghi chu dau utils/cookieToken.js ben backend).
  //
  // Duong dung la HOI MAY CHU. <NapNguoiDung /> o root layout da goi
  // GET /users/profile mot lan va cat ket qua vao kho trong RAM; vai tro trong
  // do lay thang tu CSDL nen khong sua duoc tu trinh duyet.
  //
  // Doc lai tu kho chu khong tu goi getMyProfile() o day: goi rieng la them
  // mot luot mang trung lap, va apiHelper gap 401 se tu day ve trang chu -
  // hai duong chuyen huong chay dua nhau thi rat kho lan ra khi co su co.
  useEffect(() => {
    if (dangTaiNguoiDung) return;

    if (nguoiDung?.role !== "admin") router.push("/");
  }, [dangTaiNguoiDung, nguoiDung, router]);

  const logoutHandler = async () => {
    // Truoc day cho nay chi xoa userInfo, KHONG xoa authToken - da "dang xuat"
    // ma getHeaders van gan token cu vao moi request, nguoi ke tiep dung may
    // van con la admin voi backend. xoaPhien() lam du bon viec, xem apiHelper.
    // PHAI await, neu khong dieu huong se huy request dang xuat giua chung va
    // cookie con nguyen - xem ghi chu o apiHelper.
    await xoaPhien();
    router.push("/");
  };

  return {
    pathname,
    adminName,
    loading,
    isCourseMenuOpen,
    isHomeMenuOpen,
    toggleCourseMenu: () => setMenuKhoaTuBam(!isCourseMenuOpen),
    toggleHomeMenu: () => setMenuTrangChuTuBam(!isHomeMenuOpen),
    logoutHandler,
  };
}

export type AdminShellState = ReturnType<typeof useAdminShell>;
