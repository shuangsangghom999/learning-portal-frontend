import { BlogList } from "@/src/components/features/blog";
import { BLOG } from "@/src/constants/blog";

export const metadata = BLOG.metadata;

export const revalidate = 30;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const topic = sp.topic ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  return <BlogList topic={topic} page={page} />;
}
