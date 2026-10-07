import { Loader2 } from "lucide-react";

import { ADMIN_COIN as C } from "@/src/constants/admin/coin-page";
import type { ThongTinVi } from "@/src/services/coin.api";
import type { User } from "@/src/services/userApi";

import styles from "../AdminCoin.module.scss";

const dinhDang = (n: number) => n.toLocaleString("vi-VN");

/** Mot o so lieu cua vi. */
function ODem({
  nhan,
  chinh,
  phu,
  noiBat,
}: {
  nhan: string;
  chinh: string;
  phu?: string;
  noiBat?: boolean;
}) {
  return (
    <div className={`${styles.box8} ${noiBat ? styles.box6 : styles.box7}`}>
      <p className={styles.text10}>{nhan}</p>
      <p className={styles.text11}>{chinh}</p>
      {phu && <p className={styles.text12}>{phu}</p>}
    </div>
  );
}

interface WalletSummaryProps {
  chon: User;
  vi: ThongTinVi | null;
  dangTaiVi: boolean;
}

/** Ten, email va ba o so du / tong nap / so giao dich. */
export default function WalletSummary({ chon, vi, dangTaiVi }: WalletSummaryProps) {
  return (
    <div className={styles.card3}>
      <p className={styles.text3}>{chon.name}</p>
      <p className={styles.text4}>{chon.email}</p>

      {dangTaiVi ? (
        <p className={styles.text5}>
          <Loader2 size={15} className={styles.spinner} /> {C.wallet.loading}
        </p>
      ) : vi ? (
        <div className={styles.grid3}>
          <ODem
            nhan={C.wallet.balance}
            chinh={C.wallet.coins(dinhDang(vi.soDuCoin))}
            phu={C.wallet.approx(dinhDang(vi.soDuQuyDoi))}
            noiBat
          />
          <ODem
            nhan={C.wallet.totalTopup}
            chinh={C.wallet.coins(dinhDang(vi.tongDaNap))}
          />
          <ODem nhan={C.wallet.txCount} chinh={dinhDang(vi.soGiaoDich)} />
        </div>
      ) : null}
    </div>
  );
}
