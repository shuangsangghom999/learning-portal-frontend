import { notFound } from "next/navigation";

import ArticleWithOutline from "@/src/components/common/ArticleWithOutline";
import {
  BlogDetailHeader,
  BlogDetailShell,
  layBai,
} from "@/src/components/features/portal/blog";
import { BLOG } from "@/src/constants/portal/blog-page";

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

  return (
    <BlogDetailShell>
      <BlogDetailHeader bai={bai} />
      <ArticleWithOutline
        content={bai.content ?? ""}
        goiYKhiTrong={BLOG.detail.noOutline}
      />
    </BlogDetailShell>
  );
}
