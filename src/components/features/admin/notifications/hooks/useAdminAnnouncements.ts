"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_NOTIFICATIONS as C } from "@/src/constants/admin-notifications";
import {
  guiThongBaoQuanTri,
  layThongBaoChungQuanTri,
  suaThongBaoQuanTri,
  xoaThongBaoQuanTri,
  type MucDoThongBaoChung,
  type ThongBaoChung,
  type VaiTroNhan,
} from "@/src/services/announcement";

// <input type="datetime-local"> can chuoi gio dia phuong "YYYY-MM-DDTHH:mm",
// khong nhan ISO co mui gio. Doi khi nap thong bao cu vao form de sua.
const sangGioDiaPhuong = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

/** Soan / sua / gui thong bao he thong, bat tat ghim, thu hoi. */
export function useAdminAnnouncements() {
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [duongDan, setDuongDan] = useState("");
  const [vaiTro, setVaiTro] = useState<VaiTroNhan>("");

  // Hai kenh doc lap. Mac dinh chi gui chuong nhu truoc day, de quan tri quen
  // tay khong vo tinh dang len dau trang cho ca khach thay.
  const [guiChuong, setGuiChuong] = useState(true);
  const [hienCongKhai, setHienCongKhai] = useState(false);
  const [mucDo, setMucDo] = useState<MucDoThongBaoChung>("thong_tin");
  const [hetHan, setHetHan] = useState("");

  // Dang sua dot nao (null = dang soan dot moi).
  const [dangSua, setDangSua] = useState<ThongBaoChung | null>(null);

  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [ketQua, setKetQua] = useState("");

  const [danhSach, setDanhSach] = useState<ThongBaoChung[]>([]);
  const [dangXuLy, setDangXuLy] = useState<string | null>(null);
  const [hoiXoa, setHoiXoa] = useState<string | null>(null);

  // Buoc xac nhan truoc khi gui: gui xong la moi nguoi thay ngay. Van sua va
  // thu hoi duoc, nhung trong luc chua kip sua thi ai dang mo trang cung da doc.
  const [hoiLai, setHoiLai] = useState(false);

  const taiDanhSach = useCallback(async () => {
    try {
      const kq = await layThongBaoChungQuanTri();
      setDanhSach(kq.danhSach ?? []);
    } catch {
      // Danh sach chi de xem va thao tac; tai hong thi de trong, form van dung duoc.
      setDanhSach([]);
    }
  }, []);

  // Lan tai dau viet bang .then chu khong goi taiDanhSach(): goi mot ham co
  // setState ngay trong effect bi lint react-hooks/set-state-in-effect chan.
  useEffect(() => {
    let huy = false;
    layThongBaoChungQuanTri()
      .then((kq) => {
        if (!huy) setDanhSach(kq.danhSach ?? []);
      })
      .catch(() => undefined);
    return () => {
      huy = true;
    };
  }, []);

  const datLaiForm = () => {
    setTieuDe("");
    setNoiDung("");
    setDuongDan("");
    setHetHan("");
    setMucDo("thong_tin");
    setDangSua(null);
    setHoiLai(false);
  };

  const batDauSua = (tb: ThongBaoChung) => {
    setDangSua(tb);
    setTieuDe(tb.tieuDe);
    setNoiDung(tb.noiDung ?? "");
    setDuongDan(tb.duongDan ?? "");
    setMucDo(tb.mucDo ?? "thong_tin");
    setHetHan(sangGioDiaPhuong(tb.hetHan));
    setHienCongKhai(Boolean(tb.dangHien));
    setLoi("");
    setKetQua("");
    setHoiLai(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const noiDungForm = () => ({
    tieuDe: tieuDe.trim(),
    noiDung: noiDung.trim(),
    duongDan: duongDan.trim(),
    mucDo,
    // Gio dia phuong tu o nhap -> ISO, de may chu nhan dung thoi diem.
    hetHan: hetHan ? new Date(hetHan).toISOString() : "",
  });

  const gui = async () => {
    if (dangGui) return;
    setDangGui(true);
    setLoi("");
    setKetQua("");

    try {
      if (dangSua) {
        const kq = await suaThongBaoQuanTri(dangSua._id, {
          ...noiDungForm(),
          hienDauTrang: hienCongKhai,
        });
        setKetQua(
          dangSua.guiChuong ? C.messages.savedWithBell(kq.daCapNhat) : C.messages.saved,
        );
      } else {
        const kq = await guiThongBaoQuanTri({
          ...noiDungForm(),
          hienDauTrang: hienCongKhai,
          guiChuong,
          vaiTro,
        });
        const phan: string[] = [];
        if (hienCongKhai) phan.push(C.messages.pinnedAll);
        if (guiChuong) phan.push(C.messages.sentTo(kq.daGui));
        setKetQua(C.messages.done(phan.join(", ")));
      }
      datLaiForm();
      await taiDanhSach();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.messages.sendFailed);
    } finally {
      setDangGui(false);
      setHoiLai(false);
    }
  };

  const batTatDauTrang = async (tb: ThongBaoChung) => {
    if (dangXuLy) return;
    setDangXuLy(tb._id);
    setLoi("");
    try {
      await suaThongBaoQuanTri(tb._id, {
        tieuDe: tb.tieuDe,
        noiDung: tb.noiDung,
        duongDan: tb.duongDan,
        mucDo: tb.mucDo,
        // Giu han cu chi khi con o tuong lai; da qua han thi bo, khong may chu
        // tu choi vi "ngay het han phai o sau hien tai".
        hetHan: tb.hetHan && new Date(tb.hetHan).getTime() > Date.now() ? tb.hetHan : "",
        hienDauTrang: !tb.dangHien,
      });
      await taiDanhSach();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.messages.toggleFailed);
    } finally {
      setDangXuLy(null);
    }
  };

  const xoa = async (tb: ThongBaoChung) => {
    if (dangXuLy) return;
    setDangXuLy(tb._id);
    setLoi("");
    try {
      const kq = await xoaThongBaoQuanTri(tb._id);
      setKetQua(
        tb.guiChuong
          ? C.messages.recalled(tb.tieuDe, kq.daThuHoi)
          : C.messages.deleted(tb.tieuDe),
      );
      if (dangSua?._id === tb._id) datLaiForm();
      await taiDanhSach();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.messages.deleteFailed);
    } finally {
      setDangXuLy(null);
      setHoiXoa(null);
    }
  };

  const sanSang =
    tieuDe.trim().length > 0 && (dangSua ? true : guiChuong || hienCongKhai);

  return {
    tieuDe,
    setTieuDe: (v: string) => setTieuDe(v.slice(0, C.maxTitle)),
    noiDung,
    setNoiDung: (v: string) => setNoiDung(v.slice(0, C.maxBody)),
    duongDan,
    setDuongDan,
    vaiTro,
    setVaiTro,
    guiChuong,
    setGuiChuong,
    hienCongKhai,
    setHienCongKhai,
    mucDo,
    setMucDo,
    hetHan,
    setHetHan,
    dangSua,
    dangGui,
    loi,
    ketQua,
    danhSach,
    dangXuLy,
    hoiXoa,
    setHoiXoa,
    hoiLai,
    setHoiLai,
    sanSang,
    datLaiForm,
    batDauSua,
    gui,
    batTatDauTrang,
    xoa,
  };
}

export type AdminAnnouncementsState = ReturnType<typeof useAdminAnnouncements>;
