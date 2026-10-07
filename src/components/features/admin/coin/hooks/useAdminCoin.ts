"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_COIN as C } from "@/src/constants/admin/coin-page";
import { getAllUsersAdmin } from "@/src/services/adminService";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  layViHocVien,
  napCoin,
  tangKhoa,
  type ThongTinVi,
} from "@/src/services/coin.api";
import { Course, getCourses } from "@/src/services/course";
import type { User } from "@/src/services/userApi";

export interface ThongBao {
  loai: "ok" | "loi";
  chu: string;
}

/** Tim hoc vien, doc vi, nap/thu hoi coin va tang khoa hoc. */
export function useAdminCoin() {
  const [dsNguoi, setDsNguoi] = useState<User[]>([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [dangTimNguoi, setDangTimNguoi] = useState(false);

  const [dsKhoa, setDsKhoa] = useState<Course[]>([]);
  const [chon, setChon] = useState<User | null>(null);
  const [vi, setVi] = useState<ThongTinVi | null>(null);
  const [dangTaiVi, setDangTaiVi] = useState(false);

  const [soCoin, setSoCoin] = useState("");
  const [ghiChuCoin, setGhiChuCoin] = useState("");
  const [khoaTang, setKhoaTang] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [bao, setBao] = useState<ThongBao | null>(null);

  useEffect(() => {
    getCourses()
      .then(setDsKhoa)
      .catch(() => setDsKhoa([]));
  }, []);

  const timNguoi = useCallback(async (tu: string) => {
    setDangTimNguoi(true);
    try {
      const r = await getAllUsersAdmin({ limit: C.searchLimit, search: tu || undefined });
      setDsNguoi(r.users || []);
    } catch {
      setDsNguoi([]);
    } finally {
      setDangTimNguoi(false);
    }
  }, []);

  useEffect(() => {
    // Cho 350ms sau lan go cuoi. Khong co doan nay thi go "nguyen" la ban di
    // sau luot goi may chu, va ket qua ve khong theo thu tu - man hinh nhap
    // nhay giua cac ket qua cu.
    const h = setTimeout(() => timNguoi(tuKhoa), C.searchDelay);
    return () => clearTimeout(h);
  }, [tuKhoa, timNguoi]);

  const moVi = async (nguoi: User) => {
    setChon(nguoi);
    setVi(null);
    setBao(null);
    setDangTaiVi(true);
    try {
      setVi(await layViHocVien(nguoi._id));
    } catch (e) {
      setBao({ loai: "loi", chu: getErrorMessage(e, C.messages.walletFailed) });
    } finally {
      setDangTaiVi(false);
    }
  };

  const taiLaiVi = async () => {
    if (!chon) return;
    try {
      setVi(await layViHocVien(chon._id));
    } catch {
      /* giu nguyen so lieu cu tren man hinh con hon xoa trang */
    }
  };

  const guiNapCoin = async () => {
    if (!chon) return;
    setDangGui(true);
    setBao(null);
    try {
      const r = await napCoin(chon._id, Number(soCoin), ghiChuCoin);
      setBao({ loai: "ok", chu: r.message });
      setSoCoin("");
      setGhiChuCoin("");
      await taiLaiVi();
    } catch (e) {
      setBao({ loai: "loi", chu: getErrorMessage(e, C.messages.topupFailed) });
    } finally {
      setDangGui(false);
    }
  };

  const guiTangKhoa = async () => {
    if (!chon || !khoaTang) return;
    setDangGui(true);
    setBao(null);
    try {
      const r = await tangKhoa(chon._id, khoaTang);
      setBao({ loai: "ok", chu: r.message });
      setKhoaTang("");
      await taiLaiVi();
    } catch (e) {
      setBao({ loai: "loi", chu: getErrorMessage(e, C.messages.giftFailed) });
    } finally {
      setDangGui(false);
    }
  };

  // So coin phai la so nguyen khac 0 - trung dieu kien ben may chu, de nguoi
  // dung biet ngay chu khong phai bam roi doi loi tra ve.
  const soHopLe = Number.isInteger(Number(soCoin)) && Number(soCoin) !== 0;

  return {
    dsNguoi,
    tuKhoa,
    setTuKhoa,
    dangTimNguoi,
    dsKhoa,
    chon,
    vi,
    dangTaiVi,
    soCoin,
    setSoCoin,
    ghiChuCoin,
    setGhiChuCoin,
    khoaTang,
    setKhoaTang,
    dangGui,
    bao,
    soHopLe,
    moVi,
    guiNapCoin,
    guiTangKhoa,
  };
}
