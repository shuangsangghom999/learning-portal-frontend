import { Eye, EyeOff, Megaphone, Pencil, Trash2 } from "lucide-react";

import { ADMIN_NOTIFICATIONS as C } from "@/src/constants/admin/notifications-page";
import type { ThongBaoChung } from "@/src/services/announcement";

import type { AdminAnnouncementsState } from "../hooks/useAdminAnnouncements";
import styles from "../AdminNotifications.module.scss";

const dinhDangNgay = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

const conHieuLuc = (tb: ThongBaoChung) =>
  Boolean(tb.dangHien) && (!tb.hetHan || new Date(tb.hetHan).getTime() > Date.now());

/** Danh sach thong bao da gui: nhan trang thai, sua, ghim/bo ghim, thu hoi. */
export default function AnnouncementList({ s }: { s: AdminAnnouncementsState }) {
  const L = C.list;

  return (
    <section className={styles.listCard} aria-labelledby="tb-dasgui-tieude">
      <div className={styles.row}>
        <Megaphone size={20} className={styles.box2} />
        <h2 id="tb-dasgui-tieude" className={styles.listTitle}>
          {L.title}
        </h2>
      </div>

      {s.danhSach.length === 0 ? (
        <p className={styles.empty}>{L.empty}</p>
      ) : (
        <ul className={styles.list}>
          {s.danhSach.map((tb) => {
            const dangHienNgoai = conHieuLuc(tb);
            const dangBan = s.dangXuLy === tb._id;
            return (
              <li key={tb._id} className={styles.item}>
                <div className={styles.itemMain}>
                  <div className={styles.badges}>
                    {dangHienNgoai && (
                      <span
                        className={
                          tb.mucDo === "quan_trong"
                            ? styles.badgeImportant
                            : styles.badgeInfo
                        }
                      >
                        {L.pinned}
                      </span>
                    )}
                    {tb.guiChuong && (
                      <span className={styles.badgeBell}>
                        {L.bell(tb.soNguoiNhan ?? 0, C.audienceName[tb.vaiTro ?? ""])}
                      </span>
                    )}
                    {!dangHienNgoai && !tb.guiChuong && (
                      <span className={styles.badgeMuted}>{L.hidden}</span>
                    )}
                  </div>
                  <strong className={styles.itemTitle}>{tb.tieuDe}</strong>
                  {tb.noiDung && <p className={styles.itemBody}>{tb.noiDung}</p>}
                  <span className={styles.itemMeta}>
                    {L.sentAt(dinhDangNgay(tb.createdAt))}
                    {tb.dangHien && tb.hetHan ? L.autoHide(dinhDangNgay(tb.hetHan)) : ""}
                  </span>
                </div>

                {s.hoiXoa === tb._id ? (
                  <div className={styles.actions}>
                    <span className={styles.confirmText}>
                      {tb.guiChuong
                        ? L.confirmRecall(tb.soNguoiNhan ?? 0)
                        : L.confirmDelete}
                    </span>
                    <button
                      type="button"
                      onClick={() => s.setHoiXoa(null)}
                      className={styles.button}
                    >
                      {L.no}
                    </button>
                    <button
                      type="button"
                      onClick={() => s.xoa(tb)}
                      disabled={dangBan}
                      className={styles.buttonDanger}
                    >
                      {dangBan ? L.deleting : L.delete}
                    </button>
                  </div>
                ) : (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => s.batDauSua(tb)}
                      className={styles.button}
                    >
                      <Pencil size={14} /> {L.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => s.batTatDauTrang(tb)}
                      disabled={dangBan}
                      className={styles.button}
                    >
                      {tb.dangHien ? (
                        <>
                          <EyeOff size={14} /> {L.unpin}
                        </>
                      ) : (
                        <>
                          <Eye size={14} /> {L.pin}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => s.setHoiXoa(tb._id)}
                      className={styles.buttonDangerGhost}
                    >
                      <Trash2 size={14} /> {tb.guiChuong ? L.recall : L.delete}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
