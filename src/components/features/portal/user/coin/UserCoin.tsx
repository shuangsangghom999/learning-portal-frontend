"use client";

import Link from "next/link";
import { ArrowLeft, Coins, Loader2 } from "lucide-react";

import { USER_COIN as C } from "@/src/constants/portal/user-coin-page";
import { formatVnd } from "@/src/lib/format";
import { DONG_MOI_COIN } from "@/src/services/coin.api";
import { HIEN_COIN } from "@/src/services/tinhNang";

import { useCoinTopup } from "./hooks/useCoinTopup";
import PendingTopup from "./parts/PendingTopup";
import TopupPicker from "./parts/TopupPicker";
import styles from "./UserCoin.module.scss";

function CoinTopup() {
  const s = useCoinTopup();

  return (
    <div className={styles.container}>
      <div>
        <Link href={C.profileHref} className={styles.box}>
          <ArrowLeft size={16} /> {C.back}
        </Link>
        <h1 className={styles.title}>
          <Coins size={22} className={styles.box2} /> {C.title}
        </h1>
        <p className={styles.text}>{C.intro(formatVnd(DONG_MOI_COIN))}</p>
      </div>

      {s.soDu !== null && (
        <div className={styles.card}>
          <p className={styles.text2}>{C.balanceLabel}</p>
          <p className={styles.text3}>{C.coins(s.soDu.toLocaleString("vi-VN"))}</p>
        </div>
      )}

      {s.loi && <p className={styles.text4}>{s.loi}</p>}

      {s.dangTai ? (
        <div className={styles.row}>
          <Loader2 size={22} className={styles.spinner} />
        </div>
      ) : s.yeuCau && s.yeuCau.status === "pending" ? (
        <PendingTopup s={s} yeuCau={s.yeuCau} />
      ) : (
        <TopupPicker s={s} />
      )}
    </div>
  );
}

/**
 * Trang /user/coin.
 *
 * Coin dang tam an (services/tinhNang.ts). Ai con giu duong dan cu hoac bam tu
 * mot thong bao cu thi thay mot cau giai thich, khong thay form nap tien vao
 * mot tinh nang da tat. Tach thanh component rieng de cac hook ben trong
 * CoinTopup khong bi goi co dieu kien.
 */
export default function UserCoin() {
  if (!HIEN_COIN) {
    return (
      <div className={styles.container}>
        <p>{C.disabled.text}</p>
        <Link href={C.coursesHref}>{C.disabled.back}</Link>
      </div>
    );
  }
  return <CoinTopup />;
}
