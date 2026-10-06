"use client";

import { useCallback, useEffect, useState } from "react";

import { baoCoinDaDoi } from "@/src/components/common/CoinBalance";
import { USER_COIN as C } from "@/src/constants/user-coin";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  baoDaChuyenNap,
  huyYeuCauNap,
  layViCuaToi,
  layYeuCauNap,
  taoYeuCauNap,
  type YeuCauNap,
} from "@/src/services/coin.api";

/** So du vi, tao / huy / bao da chuyen yeu cau nap, dem nguoc va do ket qua. */
export function useCoinTopup() {
  const [soDu, setSoDu] = useState<number | null>(null);
  const [soCoin, setSoCoin] = useState<number>(C.defaultCoins);
  const [yeuCau, setYeuCau] = useState<YeuCauNap | null>(null);
  const [conLai, setConLai] = useState(0);
  const [dangTai, setDangTai] = useState(true);
  const [dangTao, setDangTao] = useState(false);
  const [dangBao, setDangBao] = useState(false);
  const [daBao, setDaBao] = useState(false);
  const [mailHong, setMailHong] = useState(false);
  const [loi, setLoi] = useState("");

  // CHI doc so du, KHONG khoi phuc ma dang cho.
  //
  // Truoc day cho nay goi layYeuCauDangCho() nen reload hay bam back xong van
  // thay lai ma cu. Chu du an muon nguoc lai: roi khoi trang la mat ma, phai
  // bam tao lai. Ma chi song trong state cua trang nay.
  //
  // Ban ghi cu o may chu thi KHONG bi huy - no chuyen sang 'abandoned' va van
  // nhan tien toi het han 15 phut, nen ai lo tay F5 sau khi da chuyen khoan
  // van duoc cong dung. Xem coinNapController.taoYeuCauNap.
  const dongBo = useCallback(async () => {
    try {
      const vi = await layViCuaToi().catch(() => null);
      if (vi) setSoDu(vi.soDuCoin);
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.walletFailed));
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    // Goi qua mot vong microtask thay vi goi thang trong than effect, de
    // setState khong nam dong bo trong do (rule react-hooks/set-state-in-effect).
    void Promise.resolve().then(dongBo);
  }, [dongBo]);

  // Dong ho dem nguoc. Chi dem o may nguoi dung cho muot; con SO GIAY THAT thi
  // lay tu may chu moi lan dong bo, vi dong ho may nguoi dung co the sai gio.
  useEffect(() => {
    if (!yeuCau || yeuCau.status !== "pending") return;
    const id = setInterval(() => setConLai((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [yeuCau]);

  // Do ket qua tu may chu.
  //
  // Coin gio duoc cong TU DONG khi ngan hang bao co, khong ai bam nut nao ca.
  // Khong do thi nguoi dung chuyen tien xong ngoi nhin man hinh "dang cho" mai
  // du coin da vao vi - phai tu F5 moi thay, ma F5 thi mat ma.
  //
  // 5 giay mot lan: tien ve thuong mat 5-30 giay, do thua thi ton request ma
  // khong nhanh hon duoc, do thua thi nguoi dung tuong hong.
  useEffect(() => {
    if (!yeuCau || yeuCau.status !== "pending") return;

    let dungLai = false;
    const id = setInterval(async () => {
      try {
        const { yeuCau: moi } = await layYeuCauNap(yeuCau.code);
        if (dungLai) return;

        setYeuCau(moi);
        setConLai(moi.secondsLeft);

        if (moi.status === "paid") {
          const vi = await layViCuaToi().catch(() => null);
          if (vi && !dungLai) {
            setSoDu(vi.soDuCoin);
            // Bao cho o so du tren thanh dieu huong doc lai, khong thi hai cho
            // tren cung mot man hinh hien hai con so khac nhau.
            baoCoinDaDoi();
          }
        }
      } catch {
        // Mat mang mot nhip thi bo qua, lan do sau se bat lai. Khong hien loi
        // o day: nguoi dung dang cho tien, mot dong bao loi mang lam ho tuong
        // chuyen khoan that bai.
      }
    }, C.pollMs);

    return () => {
      dungLai = true;
      clearInterval(id);
    };
  }, [yeuCau]);

  const tao = async () => {
    setLoi("");
    if (!Number.isInteger(soCoin) || soCoin <= 0) {
      setLoi(C.messages.invalidCoins);
      return;
    }
    setDangTao(true);
    try {
      const { yeuCau: moi } = await taoYeuCauNap(soCoin);
      setYeuCau(moi);
      setConLai(moi.secondsLeft);
      setDaBao(Boolean(moi.daBaoChuyenKhoanLuc));
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.createFailed));
    } finally {
      setDangTao(false);
    }
  };

  const huy = async () => {
    if (!yeuCau) return;
    try {
      await huyYeuCauNap(yeuCau.code);
      setYeuCau(null);
      setDaBao(false);
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.cancelFailed));
    }
  };

  const bao = async () => {
    if (!yeuCau) return;
    setDangBao(true);
    try {
      const r = await baoDaChuyenNap(yeuCau.code);
      setDaBao(true);
      // Chua cau hinh mail hoac gui hong -> phai noi that. De hoc vien ngoi cho
      // mot cai mail khong bao gio den la cach chac chan nhat de mat khach: ho
      // tuong da bao roi, con quan tri thi khong biet gi.
      setMailHong(!r.daGuiMail);
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.reportFailed));
      setMailHong(true);
    } finally {
      setDangBao(false);
    }
  };

  const kiemTraLai = () => {
    void dongBo();
    baoCoinDaDoi();
  };

  return {
    soDu,
    soCoin,
    setSoCoin,
    yeuCau,
    conLai,
    dangTai,
    dangTao,
    dangBao,
    daBao,
    mailHong,
    loi,
    tao,
    huy,
    bao,
    kiemTraLai,
  };
}

export type CoinTopupState = ReturnType<typeof useCoinTopup>;
