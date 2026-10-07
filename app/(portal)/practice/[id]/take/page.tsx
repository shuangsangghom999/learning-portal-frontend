import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PracticeTest from "@/src/components/features/portal/practice/PracticeTest";
import { PRACTICE_PAGE } from "@/src/constants/portal/practice-page";
import { thamSoMoiDe, timDe } from "@/src/lib/practice";

interface Props {
  params: Promise<{ id: string }>;
}

export const generateStaticParams = thamSoMoiDe;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const de = timDe((await params).id);
  // Phong lam bai cua tung nguoi, khong can may tim kiem lap chi muc
  return de ? { title: PRACTICE_PAGE.takeTitle(de.title), robots: { index: false } } : {};
}

export default async function PracticeTakePage({ params }: Props) {
  const de = timDe((await params).id);
  if (!de) notFound();
  return <PracticeTest de={de} />;
}
