import Link from "next/link";

import OMaGiamGiaGioHang from "@/src/components/features/portal/cart/parts/CartVoucherBox";
import { CART } from "@/src/constants/portal/cart-page";
import { HIEN_COIN } from "@/src/services/tinhNang";

import type { CartState } from "../hooks/useCart";
import styles from "../Cart.module.scss";

/** Cot ben phai: tong tien, ma giam gia, thanh toan QR / coin. */
export default function CartSummary({ s }: { s: CartState }) {
  const S = CART.summary;

  return (
    <aside className={styles.aside}>
      <div className={styles.sticky}>
        <h2 className={styles.heading2}>{S.heading}</h2>

        <div className={styles.row3}>
          <span className={styles.label2}>{s.giam > 0 ? S.subtotal : S.total}</span>
          <span className={styles.label3}>{s.tongTien.toLocaleString("vi-VN")}đ</span>
        </div>

        {s.giam > 0 && (
          <div className={styles.row3}>
            <span className={styles.label2}>{S.voucher}</span>
            <span className={styles.label4}>−{s.giam.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        {HIEN_COIN && (
          <div className={styles.row4}>
            <span className={styles.label2}>{S.inCoins}</span>
            <span className={styles.label3}>{s.tongCoin.toLocaleString("vi-VN")}</span>
          </div>
        )}

        <div className={styles.box8}>
          <OMaGiamGiaGioHang
            key={s.lanMa}
            mon={s.gio.map((m) => ({ courseId: m.courseId, title: m.title }))}
            onDoiMa={s.doiMa}
          />
        </div>

        {/* Khach chua dang nhap van vao duoc trang nay - header co y cho
            ho them khoa vao gio truoc roi dang nhap sau. Khong tach
            nhanh nay thi ho thay "Ví của bạn … coin" voi mot nut xam
            khong bam duoc va khong cau nao noi ly do. */}
        {!s.user && !s.dangTai ? (
          <div className={styles.box8}>
            <p className={styles.text6}>{S.loginHint}</p>
            <Link href={s.duongDangNhap} className={styles.row5}>
              {S.login}
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={s.thanhToanQR}
              disabled={s.dangTaoDon || s.dangMua}
              className={styles.button3}
            >
              {s.dangTaoDon ? S.creatingOrder : S.payQr}
            </button>
            {s.loiDon && <p className={styles.text7}>{s.loiDon}</p>}
          </>
        )}

        {s.user && HIEN_COIN && (
          <>
            <div className={styles.box9}>
              <div className={styles.row6}>
                <span className={styles.label2}>{S.wallet}</span>
                <span
                  className={`${styles.label7} ${
                    s.duCoin ? styles.label5 : styles.label6
                  }`}
                >
                  {S.coins(
                    s.soDu === null ? S.walletLoading : s.soDu.toLocaleString("vi-VN"),
                  )}
                </span>
              </div>

              {s.soDu !== null && !s.duCoin && (
                <p className={styles.text7}>
                  {S.missing((s.tongCoin - s.soDu).toLocaleString("vi-VN"))}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={s.thanhToan}
              disabled={s.dangMua || s.dangTaoDon || !s.duCoin}
              className={styles.button4}
            >
              {s.dangMua ? S.buying : S.payCoin}
            </button>
          </>
        )}

        {/* Truoc day gio chi tra duoc bang coin vi QR khop theo TUNG don.
            Nay ca gio gom vao mot don (mot ma, mot so tien), nen chuyen
            khoan mot lan la doi chieu duoc. */}
        <p className={styles.text8}>{S.qrNote}</p>

        {s.xong && (
          <button type="button" onClick={s.toiKhoaHocCuaToi} className={styles.button4}>
            {S.toMyCourses}
          </button>
        )}
      </div>
    </aside>
  );
}
