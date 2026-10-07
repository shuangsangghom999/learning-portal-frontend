import { InstitutionDirectory } from "@/src/components/features/portal/share-document";
import { layDsTruong } from "@/src/components/features/portal/share-document/taiLieuMayChu";
import { SHARE_DOCUMENT } from "@/src/constants/portal/share-document-page";

export const metadata = SHARE_DOCUMENT.institutions.metadata;

// Danh sach truong va so tai lieu doi cham - luu 60 giay nhu API.
export const revalidate = 60;

/**
 * Danh sach truong (/share-document/institution) - nut "Xem tat ca" o khung
 * "Truong dai hoc" tai /share-document dan toi day.
 *
 * layDsTruong tra rong khi backend chet chu khong nem - nem se lam hong luot build.
 */
export default async function InstitutionPage() {
  return <InstitutionDirectory dsTruong={await layDsTruong()} />;
}
