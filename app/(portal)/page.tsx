import { HomePage } from "@/src/components/features/home";

// Trang chu doi theo khoa hoc admin dat, nen khong dung trang tinh vinh vien.
// 60 giay la muc dung hoa giua "moi vao la thay ngay" va "khong danh thuc ham
// serverless moi luot xem".
export const revalidate = 60;

export default function Page() {
  return <HomePage />;
}
