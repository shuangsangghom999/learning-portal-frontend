import { Coins, Gift } from "lucide-react";

import { ADMIN_COIN as C } from "@/src/constants/admin-coin";
import { giaRaCoin } from "@/src/services/coin.api";
import type { Course } from "@/src/services/course";

import styles from "../AdminCoin.module.scss";

const dinhDang = (n: number) => n.toLocaleString("vi-VN");

interface CoinActionsProps {
  soCoin: string;
  onSoCoin: (v: string) => void;
  ghiChu: string;
  onGhiChu: (v: string) => void;
  soHopLe: boolean;
  dsKhoa: Course[];
  khoaTang: string;
  onKhoaTang: (v: string) => void;
  dangGui: boolean;
  onNap: () => void;
  onTang: () => void;
}

/** Hai the: nap / thu hoi coin va tang khoa hoc. */
export default function CoinActions({
  soCoin,
  onSoCoin,
  ghiChu,
  onGhiChu,
  soHopLe,
  dsKhoa,
  khoaTang,
  onKhoaTang,
  dangGui,
  onNap,
  onTang,
}: CoinActionsProps) {
  const so = Number(soCoin);

  return (
    <div className={styles.grid4}>
      <div className={styles.card3}>
        <h2 className={styles.heading}>
          <Coins size={16} className={styles.box} />
          {C.adjust.heading}
        </h2>

        <input
          type="number"
          step={1}
          value={soCoin}
          onChange={(e) => onSoCoin(e.target.value)}
          placeholder={C.adjust.placeholder}
          className={styles.input2}
        />
        <p className={styles.text8}>
          {soHopLe ? (
            so > 0 ? (
              <>
                {C.adjust.add} <b>{dinhDang(so)}</b> {C.adjust.addTail}{" "}
                {dinhDang(so * C.vndPerCoin)}
                {C.adjust.addEnd}
              </>
            ) : (
              <>
                {C.adjust.revoke} <b>{dinhDang(-so)}</b> {C.adjust.revokeTail}
              </>
            )
          ) : (
            C.adjust.hint
          )}
        </p>

        <input
          value={ghiChu}
          onChange={(e) => onGhiChu(e.target.value)}
          placeholder={C.adjust.notePlaceholder}
          maxLength={C.noteMaxLength}
          className={styles.input2}
        />

        <button onClick={onNap} disabled={!soHopLe || dangGui} className={styles.button2}>
          {dangGui ? C.busy : C.adjust.submit}
        </button>
      </div>

      <div className={styles.card3}>
        <h2 className={styles.heading}>
          <Gift size={16} className={styles.box4} />
          {C.gift.heading}
        </h2>

        <select
          value={khoaTang}
          onChange={(e) => onKhoaTang(e.target.value)}
          className={styles.input2}
        >
          <option value="">{C.gift.choose}</option>
          {dsKhoa.map((k) => (
            <option key={k._id} value={k._id}>
              {k.title}
              {k.price > 0 ? C.gift.priceInCoin(giaRaCoin(k.price)) : C.gift.free}
            </option>
          ))}
        </select>

        <p className={styles.text8}>
          {C.gift.noteBefore}
          <b>{C.gift.noteStrong}</b>
          {C.gift.noteAfter}
        </p>

        <button
          onClick={onTang}
          disabled={!khoaTang || dangGui}
          className={styles.button3}
        >
          {dangGui ? C.busy : C.gift.submit}
        </button>
      </div>
    </div>
  );
}
