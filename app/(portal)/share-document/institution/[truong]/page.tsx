import { notFound } from "next/navigation";

import InstitutionDetail from "@/src/components/document/InstitutionDetail";
import { doiKhoa } from "@/src/components/document/taiLieuMayChu";
import { layTruong } from "@/src/components/features/share-document";
import { SHARE_DOCUMENT } from "@/src/constants/share-document";

// Mon hoc va so tai lieu doi cham - luu 60 giay nhu API.
export const revalidate = 60;

// Dia chi dung "hoc-vien-cong-nghe-..."; may chu doc duoc ca dang co "-".
type Params = Promise<{ truong: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { truong } = await params;
  const kq = await layTruong(doiKhoa(truong)).catch(() => null);
  if (!kq) return { title: SHARE_DOCUMENT.institution.notFoundTitle };
  return {
    title: SHARE_DOCUMENT.institution.title(kq.truong.ten),
    description: SHARE_DOCUMENT.institution.description(kq.truong.ten),
  };
}

/** Trang mot truong: /share-document/institution/<khoa>. */
export default async function InstitutionDetailPage({ params }: { params: Params }) {
  const khoa = doiKhoa((await params).truong);
  const kq = await layTruong(khoa);
  if (!kq) notFound();
  return <InstitutionDetail {...kq} />;
}
