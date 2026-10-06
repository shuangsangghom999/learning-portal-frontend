/**
 * Cach day bao lau, doc bang tieng Viet: "vừa xong", "3 giờ trước"...
 * Qua 7 ngay thi ghi ngay thang (vi-VN).
 *
 * Khong dung toLocaleString: mot cai nhan "14:32 12/09" bat nguoi doc phai tu
 * tinh xem no la lau chua. "3 giờ trước" tra loi thang cau ho dang hoi.
 *
 * Truoc day chuong thong bao, hoi dap bai hoc va trang hoi dap giang vien moi
 * noi chep mot ban. Ban 30 ngay cua blog nam o components/common/time.ts.
 */
export function khoangCach(moc: string): string {
  const giay = Math.floor((Date.now() - new Date(moc).getTime()) / 1000);

  if (giay < 60) return "vừa xong";
  if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
  if (giay < 604800) return `${Math.floor(giay / 86400)} ngày trước`;

  return new Date(moc).toLocaleDateString("vi-VN");
}

/** Ten hien thi cua mot nguoi: ten, khong co thi phan truoc @ cua email. */
export function tenHienThi(
  n: { name?: string; email?: string } | null | undefined,
  macDinh: string,
): string {
  return n?.name?.trim() || n?.email?.split("@")[0] || macDinh;
}

/** 754 -> "12:34". Luon hai chu so de con so khong nhay qua lai. So am tinh la 0. */
export function dangDongHo(giay: number): string {
  const an = Math.max(0, giay);
  return `${String(Math.floor(an / 60)).padStart(2, "0")}:${String(an % 60).padStart(2, "0")}`;
}
