import { USER_COIN as C } from "@/src/constants/user-coin";
import { formatVnd } from "@/src/lib/format";
import { DONG_MOI_COIN } from "@/src/services/coin.api";

import type { CoinTopupState } from "../hooks/useCoinTopup";
import styles from "../UserCoin.module.scss";

/** Chon goi coin co san hoac go so khac, roi tao yeu cau nap. */
export default function TopupPicker({ s }: { s: CoinTopupState }) {
  const P = C.picker;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{P.heading}</h2>

      <div className={styles.grid2}>
        {C.packages.map((g) => (
          <button
            key={g}
            onClick={() => s.setSoCoin(g)}
            className={`${styles.button7} ${
              s.soCoin === g ? styles.button5 : styles.button6
            }`}
          >
            <p className={styles.text10}>{C.coins(g.toLocaleString("vi-VN"))}</p>
            <p className={styles.text11}>{formatVnd(g * DONG_MOI_COIN)}</p>
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="so-coin" className={styles.fieldLabel}>
          {P.other}
        </label>
        <input
          id="so-coin"
          type="number"
          min={1}
          step={1}
          value={s.soCoin || ""}
          onChange={(e) => s.setSoCoin(Math.floor(Number(e.target.value)) || 0)}
          className={styles.input}
        />
        <p className={styles.text12}>
          {P.mustPay}
          <b>{formatVnd(Math.max(0, s.soCoin) * DONG_MOI_COIN)}</b>
        </p>
      </div>

      <button
        onClick={s.tao}
        disabled={s.dangTao || s.soCoin <= 0}
        className={styles.box6}
      >
        {s.dangTao ? P.creating : P.create}
      </button>
    </section>
  );
}
