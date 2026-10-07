import { notFound } from "next/navigation";

import PracticeSetup from "@/src/components/features/portal/practice/PracticeSetup";
import { thamSoMoiDe, timDe } from "@/src/lib/practice";

interface Props {
  params: Promise<{ id: string }>;
}

// De la du lieu tinh nen dung san tung trang luc build
export const generateStaticParams = thamSoMoiDe;

export async function generateMetadata({ params }: Props) {
  const de = timDe((await params).id);
  return de ? { title: de.title, description: de.description } : {};
}

export default async function PracticeDeckPage({ params }: Props) {
  const de = timDe((await params).id);
  if (!de) notFound();
  return <PracticeSetup de={de} />;
}
