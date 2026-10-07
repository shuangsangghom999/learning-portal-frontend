"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_ORDERS as C } from "@/src/constants/admin/orders-page";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  DonHangAdmin,
  TrangThaiDon,
  dinhDangTien,
  layDonHangAdmin,
  tuChoiDon,
  xacNhanDon,
} from "@/src/services/order";

/** Danh sach don, loc / tim theo ma, xac nhan da nhan tien hoac huy don. */
export function useAdminOrders() {
  const [ds, setDs] = useState<DonHangAdmin[]>([]);
  const [dangCho, setDangCho] = useState(0);
  const [daBao, setDaBao] = useState(0);
  const [loc, setLoc] = useState<TrangThaiDon | "">("pending");
  const [tim, setTim] = useState("");
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  // Ma don dang duoc xu ly - de chi khoa dung mot dong, khong khoa ca bang.
  const [dangXuLy, setDangXuLy] = useState("");

  // Tang so nay len la yeu cau tai lai. Xem ghi chu cung kieu o trang
  // thanh toan: tranh setState dong bo trong effect, va co cho huy request.
  const [lanTai, setLanTai] = useState(0);
  const taiLai = useCallback(() => setLanTai((n) => n + 1), []);

  useEffect(() => {
    let daRoiTrang = false;

    void (async () => {
      try {
        const kq = await layDonHangAdmin({ status: loc, search: tim, limit: C.limit });
        if (daRoiTrang) return;
        setDs(kq.orders);
        setDangCho(kq.pendingCount);
        setDaBao(kq.daBaoCount ?? 0);
        setLoi("");
      } catch (e) {
        if (!daRoiTrang) setLoi(getErrorMessage(e, C.messages.loadFailed));
      } finally {
        if (!daRoiTrang) setDangTai(false);
      }
    })();

    return () => {
      daRoiTrang = true;
    };
  }, [loc, tim, lanTai]);

  const xacNhan = async (don: DonHangAdmin) => {
    const ok = window.confirm(
      C.messages.confirm(dinhDangTien(don.amount), don.code, don.student?.name ?? ""),
    );
    if (!ok) return;

    setDangXuLy(don.code);
    try {
      await xacNhanDon(don.code);
      taiLai();
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.confirmFailed));
    } finally {
      setDangXuLy("");
    }
  };

  const tuChoi = async (don: DonHangAdmin) => {
    const lyDo = window.prompt(C.messages.cancelReason(don.code), "");
    if (lyDo === null) return;

    setDangXuLy(don.code);
    try {
      await tuChoiDon(don.code, lyDo);
      taiLai();
    } catch (e) {
      setLoi(getErrorMessage(e, C.messages.cancelFailed));
    } finally {
      setDangXuLy("");
    }
  };

  return {
    ds,
    dangCho,
    daBao,
    loc,
    setLoc,
    tim,
    setTim,
    dangTai,
    loi,
    dangXuLy,
    xacNhan,
    tuChoi,
  };
}
