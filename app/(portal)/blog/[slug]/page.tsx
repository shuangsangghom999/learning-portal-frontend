import { notFound } from "next/navigation";

import { BlogDetail, layBai } from "@/src/components/features/blog";
import { BLOG } from "@/src/constants/blog";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bai = await layBai(slug);
  if (!bai) return { title: BLOG.notFoundTitle };
  return { title: bai.title, description: bai.excerpt };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bai = await layBai(slug);
  if (!bai) notFound();

  return <BlogDetail bai={bai} />;
}
