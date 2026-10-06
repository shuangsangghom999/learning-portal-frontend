"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PAYMENT as P } from "@/src/constants/payment";
import { useGioHang } from "@/src/hooks/cart";
import { khoaTrongDon } from "@/src/lib/order";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  baoDaChuyenKhoan,
  huyDon,
  layDonTheoMa,
  taoDonGioHang,
  taoDonHang,
  type DonHang,
} from "@/src/services/order";

/** Doc don theo ?code=, dem nguoc, hoi lai trang thai, bao da chuyen / huy / tao ma moi. */
export function usePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ma = searchParams.get("code") || "";

  const [don, setDon] = useState<DonHang | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [conLai, setConLai] = useState(0);
  const [dangHuy, setDangHuy] = useState(false);
  const [daChepHet, setDaChepHet] = useState(false);
  const [dangBao, setDangBao] = useState(false);
  const [ketQuaBao, setKetQuaBao] = useState<{
    chu: string;
    mailHong: boolean;
  } | null>(null);
  const [dangTaoLai, setDangTaoLai] = useState(false);

  // Giu trang thai gan nhat de vong hoi khong phai phu thuoc vao state,
  // tranh dat lai setInterval moi lan don thay doi.
  const trangThaiRef = useRef<string>("");

  // Tang so nay len la yeu cau tai lai.
  //
  // Kieu nay thay cho mot ham tai() goi thang trong effect: goi thang thi
  // React canh bao setState dong bo trong effect, va quan trong hon la khong
  // co cho nao huy request khi nguoi dung roi trang giua chung - phan hoi ve
  // muon se goi setState tren mot component da bi go bo.
  const [lanTai, setLanTai] = useState(0);
  const taiLai = useCallback(() => setLanTai((n) => n + 1), []);

  useEffect(() => {
    if (!ma) return;
    let daRoiTrang = false;

    void (async () => {
      try {
        const { order } = await layDonTheoMa(ma);
        if (daRoiTrang) return;
        setDon(order);
        setConLai(order.secondsLeft);
        trangThaiRef.current = order.status;
        setLoi("");
      } catch (e) {
        if (!daRoiTrang) setLoi(getErrorMessage(e, P.messages.loadFailed));
      } finally {
        if (!daRoiTrang) setDangTai(false);
      }
    })();

    return () => {
      daRoiTrang = true;
    };
  }, [ma, lanTai]);

  // Don da duoc xac nhan thi bo cac khoa do khoi gio. Trang gio hang co y KHONG
  // xoa luc tao don (nguoi dung co the bo do giua chung), nen day la cho duy
  // nhat don gio sau khi tien da vao. Khong bo thi lan sau mo gio van thay khoa
  // da mua, bam thanh toan la bi bao "bạn đã có khóa này".
  const { bo: boKhoiGio } = useGioHang();
  useEffect(() => {
    if (don?.status !== "paid") return;
    khoaTrongDon(don).forEach((k) => boKhoiGio(k._id));
  }, [don, boKhoiGio]);

  // Dem nguoc tai cho. Chi la hien thi - moc het han that nam o may chu.
  useEffect(() => {
    if (!don || don.status !== "pending") return;
    const h = setInterval(() => setConLai((g) => Math.max(0, g - 1)), 1000);
    return () => clearInterval(h);
  }, [don]);

  // Hoi lai may chu xem quan tri da xac nhan chua.
  useEffect(() => {
    if (!don || don.status !== "pending") return;
    const h = setInterval(() => {
      if (trangThaiRef.current === "pending") taiLai();
    }, P.pollMs);
    return () => clearInterval(h);
  }, [don, taiLai]);

  const bamDaChuyen = async () => {
    if (!don) return;
    setDangBao(true);
    try {
      const r = await baoDaChuyenKhoan(don.code);
      setKetQuaBao({
        chu: r.message,
        // Chua cau hinh mail hoac gui hong -> phai noi that. De hoc vien ngoi
        // cho mot cai mail khong bao gio den la cach chac chan nhat de mat
        // khach: ho tuong da bao roi, con quan tri thi khong biet gi.
        mailHong: !r.daGuiMail,
      });
      taiLai();
    } catch (e) {
      setKetQuaBao({
        chu: getErrorMessage(e, P.messages.reportFailed),
        mailHong: true,
      });
    } finally {
      setDangBao(false);
    }
  };

  // Ma cu het han thi tao thang don moi va nhay sang, thay vi day nguoi dung
  // ve trang khoa hoc bat bam Mua lai tu dau.
  const taoMaMoi = async () => {
    if (!don?.course) return;
    setDangTaoLai(true);
    try {
      // Don gio hang thi tao lai don gio hang voi dung bo khoa do - goi
      // taoDonHang(don.course) o day la ma moi chi con tinh tien khoa dau.
      const ds = khoaTrongDon(don);
      const { order } =
        ds.length > 1
          ? await taoDonGioHang(ds.map((k) => k._id))
          : await taoDonHang(don.course._id);
      router.push(P.paymentHref(order.code));
    } catch (e) {
      setLoi(getErrorMessage(e, P.messages.newCodeFailed));
      setDangTaoLai(false);
    }
  };

  const chepThongTin = async () => {
    if (!don?.chuyenKhoan) return;
    const chuoi = P.bank.clipboardLines(don.chuyenKhoan);
    try {
      await navigator.clipboard.writeText(chuoi);
      setDaChepHet(true);
      setTimeout(() => setDaChepHet(false), 2000);
    } catch {
      /* khong co clipboard API - bo qua */
    }
  };

  const huy = async () => {
    if (!don) return;
    setDangHuy(true);
    try {
      await huyDon(don.code);
      router.push(P.coursesHref);
    } catch (e) {
      setLoi(getErrorMessage(e, P.messages.cancelFailed));
      setDangHuy(false);
    }
  };

  /** Mua bang coin xong thi vao hoc luon (khong co slug thi ve ho so). */
  const khiMuaBangCoinXong = () => {
    const slug = don?.course?.slug;
    router.push(slug ? P.learnHref(slug) : P.profileHref);
  };

  return {
    ma,
    don,
    dangTai,
    loi,
    conLai,
    dangHuy,
    daChepHet,
    dangBao,
    ketQuaBao,
    dangTaoLai,
    bamDaChuyen,
    taoMaMoi,
    chepThongTin,
    huy,
    khiMuaBangCoinXong,
  };
}

export type PaymentState = ReturnType<typeof usePayment>;
