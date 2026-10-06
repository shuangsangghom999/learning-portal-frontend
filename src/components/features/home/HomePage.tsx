import GoiYKhoaHoc from "@/src/components/courses/CourseSuggestions";
import CategoriesSection from "@/src/components/home/CategoriesSection";
import CourseSection from "@/src/components/home/CourseSection";
import FaqSection from "@/src/components/home/FaqSection";
import TrinhBay from "@/src/components/home/FeatureShowcase";
import HeroSection from "@/src/components/home/HeroSection";
import DaiDonVi from "@/src/components/home/PartnerMarquee";
import PopularCoursesSection from "@/src/components/home/PopularCoursesSection";
import TestimonialsSection from "@/src/components/home/TestimonialsSection";
import { HOME_PAGE } from "@/src/constants/home-page";

import { layDuLieuTrangChu } from "./data";

/** Trang chu (server component): lay du lieu mot lan roi xep cac muc. */
export default async function HomePage() {
  const d = await layDuLieuTrangChu();

  return (
    <>
      {/* AuthModalGate da chuyen len app/(portal)/layout.tsx: moi trang trong
          khu hoc vien deu can mo duoc hop dang nhap, khong rieng trang chu. */}
      <div>
        <HeroSection soKhoa={d.soKhoa} soMienPhi={d.soMienPhi} />
        {/* Dai chay ngang nay thay cho luoi the doi tac hoi truoc - cung mot
            noi dung (don vi dao tao), nhung gon trong mot dai. Ban luoi the cu
            da duoc go han khoi ma nguon. */}
        <DaiDonVi donVi={d.donVi} />
        <TrinhBay />
        <CategoriesSection
          initialData={d.categories}
          soKhoaTheoDanhMuc={d.soKhoaTheoDanhMuc}
        />
        <PopularCoursesSection initialData={d.mucNoiBat} />
        <CourseSection initialCourses={d.khoaDaDang} initialCategories={d.categories} />
        {/* Goi y dat SAU cac muc co san va TRUOC phan danh gia/FAQ.
            Dat tren cung thi no day muc "Khoa hoc pho bien" xuong, ma voi
            nguoi chua dang nhap thi hai muc do noi dung gan trung nhau. Dat
            duoi cung sau FAQ thi khong ai cuon toi.

            Component tu an di khi khong co goi y nao, nen khong can boc dieu
            kien o day. */}
        <GoiYKhoaHoc soLuong={HOME_PAGE.suggestionsCount} />
        <TestimonialsSection />
        <FaqSection initialData={d.faqs} />
      </div>
    </>
  );
}
