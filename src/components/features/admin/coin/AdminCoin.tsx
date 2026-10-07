"use client";

import { Coins } from "lucide-react";

import DongGiaoDichCoin from "@/src/components/common/CoinTransactionRow";
import { ADMIN_COIN as C } from "@/src/constants/admin/coin-page";

import { useAdminCoin } from "./hooks/useAdminCoin";
import CoinActions from "./parts/CoinActions";
import StudentPicker from "./parts/StudentPicker";
import WalletSummary from "./parts/WalletSummary";
import styles from "./AdminCoin.module.scss";

/** Trang /admin/coin - nap coin va tang khoa hoc cho hoc vien. */
export default function AdminCoin() {
  const s = useAdminCoin();

  return (
    <div className={styles.stack}>
      <div>
        <h1 className={styles.title}>
          <Coins className={styles.box} size={26} />
          {C.title}
        </h1>
        <p className={styles.text}>{C.intro}</p>
      </div>

      <div className={styles.grid}>
        <StudentPicker
          tuKhoa={s.tuKhoa}
          onTuKhoa={s.setTuKhoa}
          dangTim={s.dangTimNguoi}
          dsNguoi={s.dsNguoi}
          chonId={s.chon?._id}
          onChon={s.moVi}
        />

        {!s.chon ? (
          <div className={styles.card2}>{C.pickPrompt}</div>
        ) : (
          <div className={styles.stack2}>
            <WalletSummary chon={s.chon} vi={s.vi} dangTaiVi={s.dangTaiVi} />

            {s.bao && (
              <p
                className={`${styles.text13} ${
                  s.bao.loai === "ok" ? styles.text6 : styles.text7
                }`}
              >
                {s.bao.chu}
              </p>
            )}

            <CoinActions
              soCoin={s.soCoin}
              onSoCoin={s.setSoCoin}
              ghiChu={s.ghiChuCoin}
              onGhiChu={s.setGhiChuCoin}
              soHopLe={s.soHopLe}
              dsKhoa={s.dsKhoa}
              khoaTang={s.khoaTang}
              onKhoaTang={s.setKhoaTang}
              dangGui={s.dangGui}
              onNap={s.guiNapCoin}
              onTang={s.guiTangKhoa}
            />

            <div className={styles.card4}>
              <h2 className={styles.heading2}>{C.log.heading}</h2>

              {!s.vi || s.vi.nhatKy.length === 0 ? (
                <p className={styles.text9}>{C.log.empty}</p>
              ) : (
                <div className={styles.box5}>
                  {s.vi.nhatKy.map((g) => (
                    // hienNguoiTao bat: quan tri can biet dong nghiep nao vua
                    // nap coin cho nguoi nay.
                    <DongGiaoDichCoin key={g._id} giaoDich={g} hienNguoiTao />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
