import { Link2, Loader2, Save, X } from "lucide-react";

import { ADMIN_BANNERS as C } from "@/src/constants/admin-banners";
import type { BannerData } from "@/src/services/banner";

import type { AdminBannersState } from "../hooks/useAdminBanners";
import styles from "../AdminBanners.module.scss";

/** O chon mau: bang mau + o go ma hex, dong bo voi nhau. */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.row4}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input3}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input4}
        />
      </div>
    </div>
  );
}

/** Bieu mau tao / sua banner. */
export default function BannerFormPanel({ s }: { s: AdminBannersState }) {
  const F = C.form;
  const { form, set } = s;

  return (
    <form onSubmit={s.handleSubmit} className={styles.form}>
      <div className={styles.row3}>
        <h3 className={styles.subheading}>{s.editingId ? F.editTitle : F.createTitle}</h3>
        <button type="button" onClick={s.handleResetForm} className={styles.button2}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.box2}>
          <label className={styles.fieldLabel}>{F.title}</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>{F.buttonText}</label>
          <input
            type="text"
            value={form.buttonText}
            onChange={(e) => set("buttonText", e.target.value)}
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>{F.page}</label>
          <select
            value={form.page}
            onChange={(e) => set("page", e.target.value as BannerData["page"])}
            className={styles.select}
          >
            {F.pages.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.box3}>
        <label className={styles.fieldLabel}>{F.link}</label>
        <div className={styles.box4}>
          <Link2 className={styles.floating} size={16} />
          <input
            type="text"
            value={form.linkUrl}
            onChange={(e) => set("linkUrl", e.target.value)}
            placeholder={F.linkPlaceholder}
            className={styles.input2}
          />
        </div>
      </div>

      <div className={styles.box3}>
        <label className={styles.fieldLabel}>{F.description}</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
          rows={2}
          className={styles.input}
        />
      </div>

      <div className={styles.grid}>
        <ColorField
          label={F.background}
          value={form.backgroundColor}
          onChange={(v) => set("backgroundColor", v)}
        />
        <ColorField
          label={F.textColor}
          value={form.textColor}
          onChange={(v) => set("textColor", v)}
        />
        <div>
          <label className={styles.fieldLabel}>{F.order}</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
            className={styles.input5}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>{F.displayType}</label>
          <select
            value={form.displayType}
            onChange={(e) =>
              set("displayType", e.target.value as BannerData["displayType"])
            }
            className={styles.select2}
          >
            {F.displayTypes.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {form.displayType === "DISCOUNT" && (
        <div className={styles.card2}>
          <div>
            <label className={styles.fieldLabel2}>{F.discountText}</label>
            <input
              type="text"
              value={form.discountText}
              onChange={(e) => set("discountText", e.target.value)}
              className={styles.input6}
            />
          </div>
          <div>
            <label className={styles.fieldLabel2}>{F.discountSubtext}</label>
            <input
              type="text"
              value={form.discountSubtext}
              onChange={(e) => set("discountSubtext", e.target.value)}
              className={styles.input6}
            />
          </div>
        </div>
      )}

      {form.displayType === "IMAGE" && (
        <div className={styles.card3}>
          <label className={styles.fieldLabel3}>{F.image}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => s.setSelectedFile(e.target.files?.[0] || null)}
            className={styles.input7}
          />
        </div>
      )}

      <div className={styles.row5}>
        <button type="button" onClick={s.handleResetForm} className={styles.button3}>
          {F.cancel}
        </button>
        <button type="submit" disabled={s.submitting} className={styles.button4}>
          {s.submitting ? (
            <Loader2 className={styles.spinner2} size={16} />
          ) : (
            <Save size={16} />
          )}{" "}
          {F.save}
        </button>
      </div>
    </form>
  );
}
