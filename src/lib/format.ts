/** Dinh dang so tien VND kieu "1.200.000đ" (dau cham ngan cach theo vi-VN). */
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}đ`;
}
