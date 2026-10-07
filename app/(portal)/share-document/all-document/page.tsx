import type { BoLoc } from "@/src/components/features/portal/share-document/parts/ShareDocumentClient";
import {
  docLoai,
  docTuKhoa,
  doiKhoa,
} from "@/src/components/features/portal/share-document/taiLieuMayChu";
import {
  DocumentBrowser,
  layDuLieuTatCaTaiLieu,
  tenBoLoc,
} from "@/src/components/features/portal/share-document";
import { SHARE_DOCUMENT } from "@/src/constants/portal/share-document-page";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const ten = await tenBoLoc({
    mon: doiKhoa(sp.mon),
    nhom: doiKhoa(sp.nhom),
    truong: doiKhoa(sp.truong),
  });
  return {
    title: SHARE_DOCUMENT.browse.titleFor(ten),
    description: SHARE_DOCUMENT.browse.description,
  };
}

/** Tat ca tai lieu: /share-document/all-document?q=&mon=&nhom=&truong=&loai= */
export default async function AllDocumentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const loc: BoLoc = {
    q: docTuKhoa(sp.q),
    mon: doiKhoa(sp.mon),
    nhom: doiKhoa(sp.nhom),
    truong: doiKhoa(sp.truong),
    loai: docLoai(sp.loai),
  };
  const d = await layDuLieuTatCaTaiLieu(loc);

  return (
    <DocumentBrowser
      initialData={d.initialData}
      boLocBanDau={loc}
      dsNhom={d.dsNhom}
      dsTruong={d.dsTruong}
      dsMonBanDau={d.dsMon}
    />
  );
}
