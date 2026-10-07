import type { HomeSectionsState } from "@/src/components/features/portal/home/HomePopularCourses";
import { locKhoaDaDang } from "@/src/lib/filter-courses";
import { HOME_PAGE as C } from "@/src/constants/portal/home-page";
import type { Category } from "@/src/services/categoryService";
import { layIdChuDe } from "@/src/services/course";
import type { FaqItem } from "@/src/services/faq";
import type { ProviderData } from "@/src/services/provider";
import { layTuMayChu } from "@/src/services/serverFetch";

// Rong -> tra ve null chu khong phai [].
//
// Cac muc coi "co initialData" la tin hieu "khoi goi API nua". Neu luc dung
// san may chu lay hut (backend chet, mang chap chon) ma van truyen [] xuong
// thi trang se hien mot muc trong tron va KHONG bao gio thu lai. Tra null thi
// trinh duyet tu goi nhu truoc day - dung nguyen duong lui cu.
const hoacNull = <T>(ds: T[]): T[] | null => (ds.length ? ds : null);

/** Lay va tinh san moi thu trang chu can, o may chu. */
export async function layDuLieuTrangChu() {
  // Lay het o day, mot lan, song song.
  //
  // Da BO luot goi /api/banners: phan mo dau khong con la bang bang khuyen
  // mai nua. Xem ghi chu dau HeroSection.tsx.
  const [categories, providers, faqs, homeSections, coursesRes] = await Promise.all([
    layTuMayChu<Category[]>(C.api.categories, []),
    layTuMayChu<ProviderData[]>(C.api.providers, []),
    layTuMayChu<{ data?: FaqItem[] }>(C.api.faqs, {}),
    layTuMayChu<{ success?: boolean; data?: HomeSectionsState }>(C.api.homeSections, {}),
    layTuMayChu<unknown>(C.api.courses, []),
  ]);

  const muc = homeSections?.success ? homeSections.data : undefined;
  const coMuc = Boolean(
    muc &&
    (muc.mostPopular?.length || muc.trendingNow?.length || muc.newReleases?.length),
  );

  const khoaDaDang = locKhoaDaDang(coursesRes);
  const soMienPhi = khoaDaDang.filter((k) => (k.price ?? 0) === 0).length;

  // Dem so khoa hoc trong tung danh muc, dem o day chu khong goi them API.
  //
  // Danh sach khoa hoc da nam san trong tay o tren, nen viec dem la mien phi.
  // Con o phia danh muc thi con so nay la thu duy nhat tra loi duoc "bam vao
  // day co gi khong" truoc khi nguoi ta bam.
  //
  // Mot khoa co the thuoc nhieu danh muc - layIdChuDe tra ve MANG - nen tong
  // cac o dem se lon hon tong so khoa hoc, va do la dung.
  const soKhoaTheoDanhMuc: Record<string, number> = {};
  for (const khoa of khoaDaDang) {
    for (const id of layIdChuDe(khoa.category)) {
      soKhoaTheoDanhMuc[id] = (soKhoaTheoDanhMuc[id] ?? 0) + 1;
    }
  }

  return {
    soKhoa: khoaDaDang.length,
    soMienPhi,
    donVi: Array.isArray(providers) ? providers : [],
    categories: hoacNull(categories),
    soKhoaTheoDanhMuc,
    mucNoiBat: coMuc && muc ? muc : null,
    khoaDaDang: hoacNull(khoaDaDang),
    faqs: hoacNull(faqs?.data ?? []),
  };
}
