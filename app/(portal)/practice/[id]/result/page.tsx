import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PracticeReview from "@/src/components/practice/PracticeReview";
import { PRACTICE_PAGE } from "@/src/constants/practice";
import { thamSoMoiDe, timDe } from "@/src/lib/practice";

interface Props {
  params: Promise<{ id: string }>;
}

// Ma lan lam bai di qua ?lan= nen trang van dung san duoc theo de
export const generateStaticParams = thamSoMoiDe;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const de = timDe((await params).id);
  // Bai lam rieng cua tung nguoi, khong cho may tim kiem lap chi muc
  return de
    ? { title: PRACTICE_PAGE.resultTitle(de.title), robots: { index: false } }
    : {};
}

export default async function PracticeResultPage({ params }: Props) {
  const de = timDe((await params).id);
  if (!de) notFound();
  return <PracticeReview de={de} />;
}
