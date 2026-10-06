import { ADMIN_VOUCHERS as C } from "@/src/constants/admin-vouchers";
import type { ThanMaGiamGia } from "@/src/services/voucher";

import type { AdminVouchersState } from "../hooks/useAdminVouchers";
import styles from "../AdminVouchers.module.scss";

/** Bieu mau tao / sua ma giam gia. */
export default function VoucherForm({ s }: { s: AdminVouchersState }) {
  const F = C.form;
  const { than, setThan } = s;
  const phanTram = than.loai === "phanTram";

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>{s.suaId ? F.editTitle : F.createTitle}</h2>

      <div className={styles.grid}>
        {!s.suaId && (
          <label className={styles.fieldLabel}>
            <span className={styles.label}>{F.code}</span>
            <input
              id="mgg-ma"
              value={than.ma ?? ""}
              onChange={(e) =>
                setThan({
                  ...than,
                  ma: e.target.value.toUpperCase().slice(0, C.codeMaxLength),
                })
              }
              placeholder={F.codePlaceholder}
              className={styles.input}
            />
          </label>
        )}

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.description}</span>
          <input
            id="mgg-mota"
            value={than.moTa ?? ""}
            onChange={(e) => setThan({ ...than, moTa: e.target.value })}
            placeholder={F.descriptionPlaceholder}
            className={styles.input2}
          />
        </label>

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.kind}</span>
          <select
            id="mgg-loai"
            value={than.loai}
            onChange={(e) =>
              setThan({
                ...than,
                loai: e.target.value as ThanMaGiamGia["loai"],
                // Doi sang so tien thi tran giam khong con nghia - xoa luon
                // de khong luu mot gia tri vo nghia vao CSDL.
                giamToiDa: e.target.value === "phanTram" ? than.giamToiDa : null,
              })
            }
            className={styles.input2}
          >
            {F.kinds.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.value(phanTram)}</span>
          <input
            id="mgg-giatri"
            type="number"
            min={phanTram ? 1 : 0}
            max={phanTram ? 100 : undefined}
            value={than.giaTri}
            onChange={(e) => setThan({ ...than, giaTri: Number(e.target.value) })}
            className={styles.input2}
          />
        </label>

        {/* Tran giam chi co nghia voi ma phan tram. Hien no o ma so tien la
            mot o khong bao gio duoc dung toi - nguoi go se phan van. */}
        {phanTram && (
          <label className={styles.fieldLabel}>
            <span className={styles.label}>{F.cap}</span>
            <input
              id="mgg-tran"
              type="number"
              min={0}
              value={than.giamToiDa ?? ""}
              onChange={(e) =>
                setThan({
                  ...than,
                  giamToiDa: e.target.value ? Number(e.target.value) : null,
                })
              }
              className={styles.input2}
            />
          </label>
        )}

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.minOrder}</span>
          <input
            id="mgg-toithieu"
            type="number"
            min={0}
            value={than.donToiThieu ?? 0}
            onChange={(e) => setThan({ ...than, donToiThieu: Number(e.target.value) })}
            className={styles.input2}
          />
        </label>

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.start}</span>
          <input
            id="mgg-batdau"
            type="date"
            value={(than.batDau ?? "").slice(0, 10)}
            onChange={(e) => setThan({ ...than, batDau: e.target.value })}
            className={styles.input2}
          />
        </label>

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.end}</span>
          <input
            id="mgg-ketthuc"
            type="date"
            value={(than.ketThuc ?? "").slice(0, 10)}
            onChange={(e) => setThan({ ...than, ketThuc: e.target.value })}
            className={styles.input2}
          />
        </label>

        <label className={styles.fieldLabel}>
          <span className={styles.label}>{F.totalUses}</span>
          <input
            id="mgg-soluot"
            type="number"
            min={1}
            value={than.soLuotToiDa ?? ""}
            onChange={(e) =>
              setThan({
                ...than,
                soLuotToiDa: e.target.value ? Number(e.target.value) : null,
              })
            }
            className={styles.input2}
          />
        </label>

        <label className={styles.fieldLabel2}>
          <input
            id="mgg-motlan"
            type="checkbox"
            checked={than.moiNguoiMotLan !== false}
            onChange={(e) => setThan({ ...than, moiNguoiMotLan: e.target.checked })}
            className={styles.input3}
          />
          <span className={styles.label2}>
            {F.oncePerUser}
            <span className={styles.label3}>{F.oncePerUserHint}</span>
          </span>
        </label>
      </div>

      <div className={styles.row3}>
        <button type="button" onClick={s.dongForm} className={styles.button2}>
          {F.cancel}
        </button>
        <button
          type="button"
          onClick={s.luu}
          disabled={s.dangLuu || (!s.suaId && !than.ma?.trim())}
          className={styles.button3}
        >
          {s.dangLuu ? F.saving : F.save}
        </button>
      </div>
    </div>
  );
}
