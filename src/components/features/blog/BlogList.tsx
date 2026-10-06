import TieuDeMuc from "@/src/components/home/SectionHeading";
import { BLOG } from "@/src/constants/blog";

import { layDanhSachBai, taoDuongDanBlog } from "./data";
import BlogPager from "./parts/BlogPager";
import BlogPostList from "./parts/BlogPostList";
import BlogTopicsAside from "./parts/BlogTopicsAside";
import styles from "./BlogList.module.scss";

/** Trang /blog (server component): danh sach bai + loc theo chu de qua URL. */
export default async function BlogList({ topic, page }: { topic: string; page: number }) {
  const { data, topics } = await layDanhSachBai(topic, page);
  const chuDeDangChon = topics.find((t) => t.slug === topic);
  const L = BLOG.list;

  return (
    <div className={styles.page}>
      {/* max-w-7xl px-6 trung voi BlogHeader, nho vay tieu de bai va logo tren
          thanh dieu huong thang hang nhau. */}
      <div className={styles.container}>
        <TieuDeMuc
          nhu="h1"
          tieuDe={chuDeDangChon ? chuDeDangChon.name : L.title}
          moTa={L.description}
          // Dang loc theo mot chu de thi mo mot duong ra. Truoc day loi ra duy
          // nhat la cai the chu de o cot phai - ma tren man hinh hep cot do bi
          // day xuong tan duoi danh sach bai.
          xemTatCa={chuDeDangChon ? BLOG.listHref : undefined}
          chuXemTatCa={L.allPosts}
        />

        <div className={styles.grid}>
          {/* --------------------------------------------------------- */}
          {/* Cot trai - danh sach bai viet                              */}
          {/* --------------------------------------------------------- */}
          <div>
            <BlogPostList posts={data.posts} topic={topic} />

            {data.totalPages > 1 && (
              <BlogPager
                page={page}
                currentPage={data.page}
                totalPages={data.totalPages}
                hrefFor={(p) => taoDuongDanBlog(topic, { page: p })}
              />
            )}
          </div>

          {/* --------------------------------------------------------- */}
          {/* Cot phai - chu de                                          */}
          {/* --------------------------------------------------------- */}
          <BlogTopicsAside
            topics={topics}
            topic={topic}
            hrefForTopic={(slug) => taoDuongDanBlog(topic, { topic: slug, page: 1 })}
          />
        </div>
      </div>
    </div>
  );
}
