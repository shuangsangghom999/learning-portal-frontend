import { ShareDocumentHome } from "@/src/components/features/share-document";
import { SHARE_DOCUMENT } from "@/src/constants/share-document";

export const metadata = SHARE_DOCUMENT.home.metadata;

// So dem linh vuc / mon doi theo bai dang moi - luu 60 giay, giong API.
export const revalidate = 60;

export default function ShareDocumentPage() {
  return <ShareDocumentHome />;
}
