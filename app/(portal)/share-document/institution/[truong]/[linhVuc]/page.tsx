import { notFound } from "next/navigation";

import type { BoLoc } from "@/src/components/document/ShareDocumentClient";
import { docLoai, docTuKhoa, doiKhoa } from "@/src/components/document/taiLieuMayChu";
import {
  DocumentBrowser,
  layDuLieuTruongLinhVuc,
  timPhamVi,
} from "@/src/components/features/share-document";
import { SHARE_DOCUMENT } from "@/src/constants/share-document";

type Params = Promise<{ truong: string; linhVuc: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Truong + linh vuc tren dia chi -> ban ghi that; khong co thi null (404). */
async function phamViTuDiaChi(params: Params) {
  const p = await params;
  return timPhamVi(doiKhoa(p.truong), doiKhoa(p.linhVuc));
}

export async function generateMetadata({ params }: { params: Params }) {
  const pv = await phamViTuDiaChi(params);
  const C = SHARE_DOCUMENT.institutionCategory;
  if (!pv) return { title: C.notFoundTitle };
  return {
    title: C.title(pv.nhom.ten, pv.truong.ten),
    description: C.description(pv.nhom.ten, pv.truong.ten),
  };
}

/**
 * Tai lieu mot linh vuc cua mot truong:
 * /share-document/institution/<khoa-truong>/<khoa-linh-vuc>?mon=&q=&loai=
 *
 * Cung giao dien trang tat ca tai lieu, bo loc truong + linh vuc dat san.
 */
export default async function InstitutionCategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [pv, sp] = await Promise.all([phamViTuDiaChi(params), searchParams]);
  if (!pv) notFound();

  const loc: BoLoc = {
    q: docTuKhoa(sp.q),
    mon: doiKhoa(sp.mon),
    nhom: pv.nhom.key,
    truong: pv.truong.key,
    loai: docLoai(sp.loai),
  };
  const d = await layDuLieuTruongLinhVuc(pv, loc);

  return (
    <DocumentBrowser
      initialData={d.initialData}
      boLocBanDau={loc}
      dsNhom={pv.dsNhom}
      dsTruong={pv.dsTruong}
      dsMonBanDau={d.dsMon}
      phamVi={{ truong: pv.truong.key, nhom: pv.nhom.key }}
      monPhamVi={d.monPhamVi}
    />
  );
}
