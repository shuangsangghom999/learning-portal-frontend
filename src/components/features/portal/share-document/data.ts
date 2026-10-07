// Lay du lieu cho cac trang khu tai lieu, o MAY CHU.
//
// Backend chet thi tra gia tri rong chu KHONG nem loi (tru layTruong, xem ghi
// chu o do): nem o day se lam hong ca luot build tren Vercel.

import type { MucTrinhBay } from "@/src/components/features/portal/share-document/parts/DocumentShowcase";
import type { TabKhamPha } from "@/src/components/features/portal/share-document/parts/DocumentExplore";
import type { BoLoc } from "@/src/components/features/portal/share-document/parts/ShareDocumentClient";
import { DUONG_TAT_CA, duongTatCa } from "@/src/lib/document/duong-dan";
import {
  layChiTietTruong,
  layDsMon,
  layDsNhom,
  layDsTruong,
  layTrangDau,
} from "@/src/components/features/portal/share-document/taiLieuMayChu";
import { SHARE_DOCUMENT as C } from "@/src/constants/portal/share-document-page";
import {
  chuanHoaTaiLieu,
  type ChiTietTruong,
  type DocumentCategory,
  type DocumentListResponse,
  type DocumentStats,
  type DocumentSubject,
  type DocumentUniversity,
  type RecommendationResponse,
  type RecommendedDocument,
  type SharedDocument,
} from "@/src/services/document";
import type { FaqItem } from "@/src/services/faq";
import { GOC_API } from "@/src/services/serverFetch";

/**
 * Lay JSON o may chu. Backend chet thi tra gia tri rong chu KHONG nem loi: nem
 * o day se lam hong ca luot build tren Vercel.
 */
async function layJson<T>(duong: string, macDinh: T): Promise<T> {
  try {
    const res = await fetch(`${GOC_API}${duong}`, { next: { revalidate: C.revalidate } });
    if (!res.ok) return macDinh;
    return (await res.json()) as T;
  } catch {
    return macDinh;
  }
}

/* ------------------------------------------------------------------ */
/* /share-document                                                     */
/* ------------------------------------------------------------------ */

/** Moi thu trang chu khu tai lieu can, da xep san cho tung section. */
export async function layDuLieuTrangTaiLieu() {
  const [dsMon, dsNhom, dsTruong, thongKe, moiNhat, faqs] = await Promise.all([
    layJson<DocumentSubject[]>(C.api.subjects, []),
    layJson<DocumentCategory[]>(C.api.categories, []),
    layJson<DocumentUniversity[]>(C.api.universities, []),
    layJson<DocumentStats | null>(C.api.stats, null),
    layJson<DocumentListResponse | null>(C.api.latest, null),
    layJson<{ data?: FaqItem[] } | null>(C.api.faqs, null),
  ]);

  // Section "Danh rieng cho mon hoc cua ban": moi linh vuc CO tai lieu mot tab,
  // kem mot tai lieu cua no. Toi da 6 tab - hang tab dai hon thi nguoi xem
  // khong doc het, va moi tab la mot luot goi API.
  //
  // Mot tai lieu gan nhieu mon co the thuoc nhieu linh vuc (vd. "toán" +
  // "dữ liệu"): lay vai ung vien moi linh vuc roi chon bai CHUA hien o tab
  // truoc, de cac tab khong lap lai cung mot tai lieu.
  const nhomCoTaiLieu = dsNhom
    .filter((n) => n.soTaiLieu > 0)
    .slice(0, C.home.maxCategoryTabs);
  //
  // Cung mot luot goi phuc vu ca section "Kham pha tai lieu" ben duoi (8 bai
  // moi linh vuc), nen lay 8 chu khong phai 4.
  const [ungVien, noiBat] = await Promise.all([
    Promise.all(
      nhomCoTaiLieu.map((nhom) =>
        layJson<DocumentListResponse | null>(C.api.byCategory(nhom.key), null),
      ),
    ),
    layJson<DocumentListResponse | null>(C.api.mostDownloaded, null),
  ]);
  const daDung = new Set<string>();
  const dsTrinhBay: MucTrinhBay[] = [];
  nhomCoTaiLieu.forEach((nhom, i) => {
    const ds = ungVien[i]?.documents ?? [];
    const taiLieu = ds.find((d) => !daDung.has(d._id)) ?? ds[0];
    if (!taiLieu) return;
    daDung.add(taiLieu._id);
    dsTrinhBay.push({ nhom, taiLieu: chuanHoaTaiLieu(taiLieu) });
  });

  // Section "Kham pha tai lieu tu cong dong": tab Noi bat (tai nhieu nhat) +
  // moi linh vuc co tai lieu.
  const dsTabKhamPha: TabKhamPha[] = [
    {
      khoa: C.home.featuredTab.key,
      ten: C.home.featuredTab.name,
      dsTaiLieu: (noiBat?.documents ?? []).map(chuanHoaTaiLieu),
      xemThem: DUONG_TAT_CA,
    },
    ...nhomCoTaiLieu.map((nhom, i) => ({
      khoa: nhom.key,
      ten: nhom.ten,
      dsTaiLieu: (ungVien[i]?.documents ?? []).map(chuanHoaTaiLieu),
      xemThem: duongTatCa({ nhom: nhom.key }),
    })),
  ];

  return {
    dsMon,
    dsNhom,
    dsTruong,
    thongKe,
    moiNhat: (moiNhat?.documents ?? []).map(chuanHoaTaiLieu),
    faqs: faqs?.data ?? null,
    dsTrinhBay,
    dsTabKhamPha,
  };
}

/* ------------------------------------------------------------------ */
/* /share-document/all-document                                        */
/* ------------------------------------------------------------------ */

/** Ten hien tren tieu de: mon > linh vuc > truong (cung thu tu uu tien voi trang). */
export async function tenBoLoc(loc: Pick<BoLoc, "mon" | "nhom" | "truong">) {
  return loc.mon
    ? (await layDsMon()).find((m) => m.key === loc.mon)?.ten
    : loc.nhom
      ? (await layDsNhom()).find((n) => n.key === loc.nhom)?.ten
      : loc.truong
        ? (await layDsTruong()).find((t) => t.key === loc.truong)?.ten
        : undefined;
}

/** Trang dau theo bo loc + cac danh sach cho o chon. */
export async function layDuLieuTatCaTaiLieu(loc: BoLoc) {
  const [initialData, dsNhom, dsTruong, dsMon] = await Promise.all([
    layTrangDau(loc),
    layDsNhom(),
    layDsTruong(),
    layDsMon(),
  ]);
  return { initialData, dsNhom, dsTruong, dsMon };
}

/* ------------------------------------------------------------------ */
/* /share-document/all-document/[id]                                   */
/* ------------------------------------------------------------------ */

export async function layTaiLieu(id: string): Promise<SharedDocument | null> {
  try {
    const res = await fetch(`${GOC_API}${C.api.document(id)}`, {
      next: { revalidate: C.documentRevalidate },
    });
    if (!res.ok) return null;
    // Chuan hoa: ban luu cache co the con dang cu - xem chuanHoaTaiLieu.
    return chuanHoaTaiLieu((await res.json()) as SharedDocument);
  } catch {
    return null;
  }
}

// Tai lieu cho cot ben phai: GOI Y lien quan toi tai lieu dang xem (cung mon,
// gan tieu de, duoc tai nhieu). Truoc day chi la 6 tai lieu moi nhat - khong
// lien quan gi den tai lieu dang mo.
//
// Goi o MAY CHU nen khong mang cookie cua nguoi xem: ket qua la ban "khach" -
// chi dua tren tai lieu dang xem, khong dua tren lich su rieng. Dung y do: o
// trang chi tiet thu can la "lien quan toi TAI LIEU NAY", va nho vay ket qua
// giong nhau voi moi nguoi nen luu lai 60 giay duoc. Goi y theo lich su rieng
// nam o tab "Goi y cho ban" trang danh sach.
//
// May chu tu loai chinh tai lieu dang xem ra, khong phai loc o day.
//
// Hong thi tra ve mang rong chu khong nem loi: cot ben phai la phan phu, khong
// duoc phep lam sap ca trang tai lieu chinh.
export async function layLienQuan(id: string): Promise<RecommendedDocument[]> {
  try {
    const res = await fetch(`${GOC_API}${C.api.related(id)}`, {
      next: { revalidate: C.revalidate },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as RecommendationResponse;
    return (json.documents ?? []).map(chuanHoaTaiLieu);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* /share-document/institution/...                                     */
/* ------------------------------------------------------------------ */

/**
 * Mot truong cho trang /share-document/institution/<khoa>.
 *
 * null = khong co truong nay (404). Loi khac (backend chet...) thi NEM: bao
 * "khong co truong" trong khi truong co that se lam nguoi dung tuong link sai.
 */
export async function layTruong(khoa: string): Promise<ChiTietTruong | null> {
  const res = await fetch(`${GOC_API}${C.api.university(khoa)}`, {
    next: { revalidate: C.revalidate },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(C.institution.loadFailed(res.status));
  return (await res.json()) as ChiTietTruong;
}

/** Truong + linh vuc tren dia chi -> ban ghi that; khong co thi null (404). */
export async function timPhamVi(khoaTruong: string, khoaNhom: string) {
  const [dsTruong, dsNhom] = await Promise.all([layDsTruong(), layDsNhom()]);
  const truong = dsTruong.find((t) => t.key === khoaTruong);
  const nhom = dsNhom.find((n) => n.key === khoaNhom);
  return truong && nhom ? { truong, nhom, dsTruong, dsNhom } : null;
}

export type PhamViTruongLinhVuc = NonNullable<Awaited<ReturnType<typeof timPhamVi>>>;

/** Trang dau + mon cua truong trong linh vuc nay (o chon mon va o "N môn học"). */
export async function layDuLieuTruongLinhVuc(pv: PhamViTruongLinhVuc, loc: BoLoc) {
  const [initialData, dsMon, ct] = await Promise.all([
    layTrangDau(loc),
    layDsMon(),
    layChiTietTruong(pv.truong.key),
  ]);
  const monPhamVi = (ct?.monHoc ?? [])
    .filter((m) => m.nhom === pv.nhom._id)
    .map(({ key, ten, soTaiLieu }) => ({ key, ten, soTaiLieu }));
  return { initialData, dsMon, monPhamVi };
}
