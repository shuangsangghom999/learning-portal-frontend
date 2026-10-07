import Link from "next/link";
import { Check, CreditCard, ShieldCheck, ShoppingCart } from "lucide-react";

import NutMuaBangCoin from "@/src/components/common/BuyWithCoinButton";
import ONhapMaGiamGia from "@/src/components/features/portal/course/parts/VoucherInput";
import { COURSE_PAGE as C } from "@/src/constants/portal/course-page";
import { formatVnd } from "@/src/lib/format";
import { giaRaCoin } from "@/src/services/coin.api";
import type { Course } from "@/src/services/course";
import { HIEN_COIN } from "@/src/services/tinhNang";

import type { CourseDetailState } from "../hooks/useCourseDetail";
import styles from "../CourseDetail.module.scss";

/* CỘT PHẢI: BANNER BOX PHỤ (TRÁNH BỊ TRỐNG KHI CUỘN) */
export default function CoursePurchaseCard({
  s,
  course,
}: {
  s: CourseDetailState;
  course: Course;
}) {
  const P = C.purchase;
  const gia = course.price ?? 0;

  return (
    <div id={C.buyAnchorId} className={styles.stack10}>
      <div className={styles.card12}>
        <div className={styles.stack8}>
          <span className={styles.label11}>{P.priceLabel}</span>
          <div className={styles.box43}>
            {gia === 0 ? (
              <span className={styles.label12}>{P.free}</span>
            ) : (
              <span>{formatVnd(gia)}</span>
            )}
          </div>
        </div>

        {s.error && !s.isEnrolled && (
          <div className={styles.card13}>
            <p className={styles.text15}>{s.error}</p>
          </div>
        )}

        {s.isEnrolled ? (
          <Link href={C.learnHref(s.courseSlug)} className={styles.card14}>
            {P.continue}
          </Link>
        ) : (
          <div className={styles.stack2}>
            {/* O nhap ma dat TREN ca hai nut mua: nguoi dung phai ap ma
                xong roi moi bam mua, khong phai bam mua roi moi phat
                hien ra minh quen nhap ma. */}
            {gia > 0 && <ONhapMaGiamGia courseId={course._id} onDoiMa={s.doiMaGiamGia} />}

            {s.soTienGiam > 0 && (
              <p className={styles.text16}>
                <span className={styles.label13}>{formatVnd(gia)}</span>{" "}
                <span className={styles.label14}>
                  {formatVnd(Math.max(0, gia - s.soTienGiam))}
                </span>
              </p>
            )}

            {/* Coin di TRUOC chuyen khoan: ai co san coin thi mo khoa
                ngay tai day, khong phai qua man hinh QR roi ngoi cho
                quan tri doi chieu. Ai khong du coin thi component nay tu
                bao thieu bao nhieu, va nut chuyen khoan ben duoi van con
                nguyen. */}
            {HIEN_COIN && gia > 0 && (
              <NutMuaBangCoin
                courseId={course._id}
                gia={gia}
                maGiamGia={s.maGiamGia}
                soCoinGiam={giaRaCoin(s.soTienGiam)}
                khiMuaXong={s.khiMuaBangCoinXong}
              />
            )}

            {/* Them vao gio chi co nghia voi khoa CO PHI: khoa mien phi
                thi bam mot cai la vao hoc duoc ngay, bo vao gio roi quay
                lai thanh toan la bat nguoi ta di duong vong. */}
            {gia > 0 &&
              (s.coTrongGio(course._id) ? (
                <Link href={C.cartHref} className={styles.card15}>
                  <Check size={16} /> {P.inCart}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={s.themKhoaVaoGio}
                  className={styles.button10}
                >
                  <ShoppingCart size={16} /> {P.addToCart}
                </button>
              ))}

            <button
              onClick={s.handleEnrollCourse}
              disabled={s.submitting}
              className={styles.button11}
            >
              <CreditCard size={15} />
              {s.submitting ? P.linking : gia > 0 ? P.transfer : P.enroll}
            </button>
          </div>
        )}

        <div className={styles.stack11}>
          {P.perks.map((perk) => (
            <div key={perk} className={styles.row21}>
              <ShieldCheck size={16} className={styles.box44} />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
