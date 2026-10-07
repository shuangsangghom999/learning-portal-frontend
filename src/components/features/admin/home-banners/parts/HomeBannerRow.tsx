import SafeImage from "@/src/components/ui/SafeImage";
import { ADMIN_HOME_BANNERS as C } from "@/src/constants/admin/home-banners-page";
import type { BannerData } from "@/src/services/banner";

import styles from "../AdminHomeBanners.module.scss";

interface HomeBannerRowProps {
  banner: BannerData;
  updating: boolean;
  onToggle: (id: string, currentStatus: boolean) => void;
}

/** Mot banner: xem truoc, loai/vi tri, thu tu va cong tac kich hoat. */
export default function HomeBannerRow({
  banner,
  updating,
  onToggle,
}: HomeBannerRowProps) {
  return (
    <tr className={styles.row4}>
      <td className={styles.headCell}>
        <div className={styles.row2}>
          {banner.displayType === "IMAGE" && banner.imageUrl ? (
            <SafeImage
              src={banner.imageUrl}
              alt={banner.title}
              width={56}
              height={36}
              className={styles.box4}
            />
          ) : (
            <div
              style={{ backgroundColor: banner.backgroundColor }}
              className={styles.row5}
            >
              {banner.discountText || C.discountFallback}
            </div>
          )}
          <div>
            <span className={styles.label}>{banner.title}</span>
            <p className={styles.text2}>{banner.description}</p>
          </div>
        </div>
      </td>
      <td className={styles.headCell}>
        <p className={styles.text3}>{banner.displayType}</p>
        <p className={styles.text4}>{C.pageLabel(banner.page)}</p>
      </td>
      <td className={styles.cell}>
        {C.orderLabel(banner.backgroundColor ? C.orderValue(banner.order) : "0")}
      </td>
      <td className={styles.headCell2}>
        <button
          type="button"
          disabled={updating}
          onClick={() => onToggle(banner._id, !!banner.isActive)}
          className={`${styles.button4} ${banner.isActive ? styles.button : styles.button2} ${
            updating ? styles.button3 : ""
          }`}
        >
          <span
            className={`${styles.label4} ${banner.isActive ? styles.label2 : styles.label3}`}
          />
        </button>
      </td>
    </tr>
  );
}
