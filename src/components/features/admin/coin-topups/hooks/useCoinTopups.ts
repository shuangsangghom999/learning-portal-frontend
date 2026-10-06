"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_COIN_TOPUPS as C } from "@/src/constants/admin-coin-topups";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  layDanhSachNapAdmin,
  tuChoiNapAdmin,
  xacNhanNapAdmin,
  type TrangThaiNap,
  type YeuCauNapAdmin,
} from "@/src/services/coin.api";

/** Hang doi yeu cau nap coin: loc, phan trang, xac nhan / huy. */
export function useCoinTopups() {
  const [rows, setRows] = useState<YeuCauNapAdmin[]>([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  // Mac dinh loc 'pending': day la mot hang doi viec, khong phai so luu tru.
  const [loc, setLoc] = useState<TrangThaiNap | "">("pending");
  const [dangTai, setDangTai] = useState(true);
  const [banMa, setBanMa] = useState<string | null>(null);
  const [loi, setLoi] = useState("");

  const doc = useCallback(async () => {
    setDangTai(true);
    setLoi("");
    try {
      const kq = await layDanhSachNapAdmin({ status: loc, page, limit: C.pageSize });
      setRows(kq.yeuCau);
      setPages(kq.pages);
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.loadFailed));
    } finally {
      setDangTai(false);
    }
  }, [loc, page]);

  useEffect(() => {
    void Promise.resolve().then(doc);
  }, [doc]);

  const doiLoc = (t: TrangThaiNap | "") => {
    setLoc(t);
    setPage(1);
  };

  const xacNhan = async (yc: YeuCauNapAdmin) => {
    // Hoi lai vi day la buoc BO TIEN THAT vao vi nguoi khac, va khong co nut
    // hoan tac: coin cong roi thi phai thu hoi tay o trang Coin & Qua tang.
    const dong = window.confirm(
      C.messages.confirm(
        yc.amount.toLocaleString("vi-VN"),
        yc.code,
        yc.soCoin.toLocaleString("vi-VN"),
        yc.student?.name || C.messages.studentFallback,
      ),
    );
    if (!dong) return;

    setBanMa(yc.code);
    try {
      const kq = await xacNhanNapAdmin(yc.code);
      alert(kq.message);
      await doc();
    } catch (e) {
      alert(getErrorMessage(e, C.messages.confirmFailed));
    } finally {
      setBanMa(null);
    }
  };

  const tuChoi = async (yc: YeuCauNapAdmin) => {
    const lyDo = window.prompt(C.messages.cancelReason, "");
    if (lyDo === null) return;

    setBanMa(yc.code);
    try {
      await tuChoiNapAdmin(yc.code, lyDo);
      await doc();
    } catch (e) {
      alert(getErrorMessage(e, C.messages.cancelFailed));
    } finally {
      setBanMa(null);
    }
  };

  return {
    rows,
    pages,
    page,
    setPage,
    loc,
    doiLoc,
    dangTai,
    banMa,
    loi,
    xacNhan,
    tuChoi,
  };
}
