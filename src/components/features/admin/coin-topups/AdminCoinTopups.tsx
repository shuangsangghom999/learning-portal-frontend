"use client";

import { Coins, Loader2 } from "lucide-react";

import Pager from "@/src/components/common/Pager";
import { ADMIN_COIN_TOPUPS as C } from "@/src/constants/admin-coin-topups";

import { useCoinTopups } from "./hooks/useCoinTopups";
import TopupRow from "./parts/TopupRow";
import styles from "./AdminCoinTopups.module.scss";

/** Trang /admin/coin-topups - duyet yeu cau nap coin theo sao ke. */
export default function AdminCoinTopups() {
  const s = useCoinTopups();

  return (
    <div className={styles.stack}>
      <div>
        <h1 className={styles.title}>
          <Coins size={22} className={styles.box} /> {C.title}
        </h1>
        <p className={styles.text}>{C.intro}</p>
      </div>

      <div className={styles.row}>
        {C.filters.map((t) => (
          <button
            key={t || "all"}
            onClick={() => s.doiLoc(t)}
            className={`${styles.button5} ${s.loc === t ? styles.button : styles.button2}`}
          >
            {t ? C.statusLabel[t] : C.allLabel}
          </button>
        ))}
      </div>

      {s.loi && <p className={styles.text2}>{s.loi}</p>}

      <div className={styles.card}>
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                {C.columns.map((col, i) => (
                  <th
                    key={col}
                    className={
                      i === C.columns.length - 1 ? styles.headCell2 : styles.headCell
                    }
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {s.dangTai ? (
                <tr>
                  <td colSpan={6} className={styles.cell}>
                    <Loader2 size={20} className={styles.spinner} />
                  </td>
                </tr>
              ) : s.rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.cell2}>
                    {C.empty}
                  </td>
                </tr>
              ) : (
                s.rows.map((yc) => (
                  <TopupRow
                    key={yc._id}
                    yc={yc}
                    busy={s.banMa === yc.code}
                    onConfirm={s.xacNhan}
                    onCancel={s.tuChoi}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pager
          page={s.page}
          pages={s.pages}
          setPage={s.setPage}
          iconSize={16}
          withLabels={false}
          classes={{
            wrap: styles.row4,
            info: styles.text7,
            group: styles.row5,
            button: styles.box2,
          }}
        />
      </div>
    </div>
  );
}
