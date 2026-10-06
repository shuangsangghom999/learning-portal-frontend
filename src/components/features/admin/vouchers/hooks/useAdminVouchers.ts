"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_VOUCHERS as C } from "@/src/constants/admin-vouchers";
import {
  batTatMa,
  danhSachMa,
  luotDungCuaMa,
  suaMa,
  taoMa,
  type LuotDung,
  type MaGiamGia,
  type ThanMaGiamGia,
} from "@/src/services/voucher";

const ngayISO = (lech = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + lech);
  return d.toISOString().slice(0, 10);
};

/** Bieu mau ma moi (tinh mot lan luc nap module, nhu ban cu). */
export const MAC_DINH: ThanMaGiamGia = {
  ma: "",
  moTa: "",
  loai: "phanTram",
  giaTri: 10,
  donToiThieu: 0,
  giamToiDa: null,
  batDau: ngayISO(),
  ketThuc: ngayISO(C.defaultDays),
  soLuotToiDa: null,
  moiNguoiMotLan: true,
  hoatDong: true,
};

// Ma kem co "da het han", tinh MOT LAN luc du lieu ve.
//
// Khong tinh trong luc ve (`new Date(m.ketThuc) < Date.now()` giua JSX): doc
// dong ho la mot phep khong thuan, hai lan ve co the ra hai ket qua khac nhau.
// react-hooks/purity chan dung cho do. Tinh o day thi no la mot gia tri co
// dinh di kem du lieu.
export type MaHienThi = MaGiamGia & { hetHan: boolean };

const danhDauHetHan = (ds: MaGiamGia[]): MaHienThi[] => {
  const bayGio = Date.now();
  return ds.map((m) => ({ ...m, hetHan: new Date(m.ketThuc).getTime() < bayGio }));
};

const motMa = (m: MaGiamGia): MaHienThi => danhDauHetHan([m])[0];

/** Danh sach ma giam gia, bieu mau tao / sua, bat tat, xem luot dung. */
export function useAdminVouchers() {
  const [danhSach, setDanhSach] = useState<MaHienThi[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const [moForm, setMoForm] = useState(false);
  const [suaId, setSuaId] = useState<string | null>(null);
  const [than, setThan] = useState<ThanMaGiamGia>(MAC_DINH);
  const [dangLuu, setDangLuu] = useState(false);

  const [xemLuot, setXemLuot] = useState<string | null>(null);
  const [luot, setLuot] = useState<{ danhSach: LuotDung[]; tongGiam: number } | null>(
    null,
  );

  const nap = useCallback(async () => {
    setDangTai(true);
    setLoi("");

    try {
      const kq = await danhSachMa(1);
      setDanhSach(danhDauHetHan(kq.danhSach));
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.messages.loadFailed);
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(nap);
  }, [nap]);

  const moTaoMoi = () => {
    setSuaId(null);
    setThan(MAC_DINH);
    setMoForm(true);
  };

  const dongForm = () => {
    setMoForm(false);
    setSuaId(null);
  };

  const luu = async () => {
    if (dangLuu) return;
    setDangLuu(true);
    setLoi("");

    try {
      if (suaId) {
        // `ma` khong duoc gui khi sua: may chu khong cho doi chuoi ma sau khi
        // da phat, vi doi la lam hong moi cho da chia se ma do.
        const { ma: _bo, ...conLai } = than;
        void _bo;
        const kq = await suaMa(suaId, conLai as ThanMaGiamGia);
        setDanhSach((cu) => cu.map((m) => (m._id === suaId ? motMa(kq.ma) : m)));
      } else {
        const kq = await taoMa(than);
        setDanhSach((cu) => [motMa(kq.ma), ...cu]);
      }

      setMoForm(false);
      setSuaId(null);
      setThan(MAC_DINH);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.messages.saveFailed);
    } finally {
      setDangLuu(false);
    }
  };

  const batTat = async (id: string) => {
    try {
      const kq = await batTatMa(id);
      setDanhSach((cu) => cu.map((m) => (m._id === id ? motMa(kq.ma) : m)));
    } catch (e) {
      setLoi(e instanceof Error ? e.message : C.messages.toggleFailed);
    }
  };

  const moLuot = async (id: string) => {
    setXemLuot(id);
    setLuot(null);

    try {
      setLuot(await luotDungCuaMa(id));
    } catch {
      setLuot({ danhSach: [], tongGiam: 0 });
    }
  };

  return {
    danhSach,
    dangTai,
    loi,
    moForm,
    suaId,
    than,
    setThan,
    dangLuu,
    xemLuot,
    dongLuot: () => setXemLuot(null),
    luot,
    moTaoMoi,
    dongForm,
    luu,
    batTat,
    moLuot,
  };
}

export type AdminVouchersState = ReturnType<typeof useAdminVouchers>;
