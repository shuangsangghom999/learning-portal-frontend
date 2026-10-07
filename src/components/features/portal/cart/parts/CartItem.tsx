import Image from "next/image";
import { CircleCheck, CircleX, Trash2 } from "lucide-react";

import { CART } from "@/src/constants/portal/cart-page";
import { giaRaCoin } from "@/src/services/coin.api";
import { HIEN_COIN } from "@/src/services/tinhNang";
import type { CartItemStatus } from "@/src/types/cart";

import styles from "../Cart.module.scss";

interface CartItemProps {
  title: string;
  thumbnail?: string | null;
  gia: number;
  status?: CartItemStatus;
  error?: string;
  disabled: boolean;
  onRemove: () => void;
}

/** Mot khoa trong gio: anh, gia, trang thai mua va nut bo khoi gio. */
export default function CartItem({
  title,
  thumbnail,
  gia,
  status,
  error,
  disabled,
  onRemove,
}: CartItemProps) {
  const I = CART.item;

  return (
    <article className={styles.article}>
      <div className={styles.box4}>
        {thumbnail && (
          <Image src={thumbnail} alt={title} fill sizes="112px" className={styles.box5} />
        )}
      </div>

      <div className={styles.box6}>
        <h2 className={styles.heading}>{title}</h2>
        <p className={styles.text2}>
          {gia.toLocaleString("vi-VN")}đ
          {HIEN_COIN && (
            <span className={styles.label}>
              {I.coins(giaRaCoin(gia).toLocaleString("vi-VN"))}
            </span>
          )}
        </p>

        {status === "xong" && (
          <p className={styles.text3}>
            <CircleCheck size={12} /> {I.unlocked}
          </p>
        )}
        {status === "hong" && (
          <p className={styles.text4}>
            <CircleX size={12} className={styles.box7} />
            {error || I.failed}
          </p>
        )}
        {status === "dangMua" && <p className={styles.text5}>{I.buying}</p>}
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={I.removeAria(title)}
        className={styles.button}
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}
