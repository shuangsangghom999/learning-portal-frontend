"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { duongDanDangNhap } from "@/src/components/auth/loginUrl";
import { CART } from "@/src/constants/cart";
import { useGioHang } from "@/src/hooks/cart";
import { useDangTaiNguoiDung, useNguoiDungLuu } from "@/src/hooks/userStore";
import { getErrorMessage } from "@/src/services/apiHelper";
import { giaRaCoin, layViCuaToi, muaBangCoin } from "@/src/services/coin.api";
import { taoDonGioHang } from "@/src/services/order";
import { HIEN_COIN } from "@/src/services/tinhNang";
import type { CartItemStatus } from "@/src/types/cart";

/** Gio hang, ma giam gia, tao don QR va mua lan luot bang coin. */
export function useCart() {
  const router = useRouter();
  const { gio, bo, doSach, tongTien, soMon } = useGioHang();

  const user = useNguoiDungLuu();
  const dangTai = useDangTaiNguoiDung();
  const duongDan = usePathname();

  // KHONG dung useSearchParams() o day, du cac cho khac trong du an co dung.
  //
  // Hook do bat trang phai ve o trinh duyet, nen /cart roi khoi dang dung san
  // luc build va Next bao loi "should be wrapped in a suspense boundary".
  // Doi lai duoc gi? Giu cac tham so tren thanh dia chi khi mo hop dang nhap -
  // ma /cart thi khong co tham so nao dang giu. Tra mot trang dung san lay mot
  // thu khong ton tai la lo.
  const duongDangNhap = duongDanDangNhap(duongDan, new URLSearchParams());

  const [soDu, setSoDu] = useState<number | null>(null);
  const [dangMua, setDangMua] = useState(false);
  const [trangThai, setTrangThai] = useState<Record<string, CartItemStatus>>({});
  const [loiTheoMon, setLoiTheoMon] = useState<Record<string, string>>({});
  const [xong, setXong] = useState(false);

  // Ma giam gia an vao DUNG MOT khoa - xem ghi chu trong OMaGiamGiaGioHang.
  const [ma, setMa] = useState("");
  const [maCuaKhoa, setMaCuaKhoa] = useState("");
  const [giam, setGiam] = useState(0);

  // Dem de dung lam `key`, tang len la o nhap ma duoc dung lai tu dau.
  //
  // O nhap tu giu trang thai "da ap ma nao" ben trong no. Khi trang cha go ma
  // (nguoi dung bo khoa duoc giam ra khoi gio, hoac mua xong), khong doi `key`
  // thi o nhap van hien khung xanh "da ap MA123" trong khi tong tien khong con
  // tru gi nua - hai con so tren cung mot man hinh noi hai chuyen khac nhau.
  const [lanMa, setLanMa] = useState(0);

  const [dangTaoDon, setDangTaoDon] = useState(false);
  const [loiDon, setLoiDon] = useState("");

  useEffect(() => {
    // Coin dang an thi khoi hoi so du - mot luot goi mang thua moi lan mo gio.
    if (!HIEN_COIN) return;
    layViCuaToi()
      .then((v) => setSoDu(v.soDuCoin))
      .catch(() => setSoDu(null));
  }, []);

  /**
   * Gom ca gio vao MOT don roi sang trang QR. Gio KHONG bi xoa o day: nguoi
   * dung co the dong trang QR ma chua chuyen tien, xoa gio luc nay la mat het
   * nhung gi ho da chon. Trang thanh toan tu bo cac khoa khoi gio khi don da
   * duoc xac nhan.
   */
  const thanhToanQR = async () => {
    if (dangTaoDon || gio.length === 0) return;
    setDangTaoDon(true);
    setLoiDon("");
    try {
      const { order } = await taoDonGioHang(
        gio.map((m) => m.courseId),
        ma && maCuaKhoa ? { maGiamGia: ma, courseIdGiam: maCuaKhoa } : undefined,
      );
      router.push(CART.paymentHref(order.code));
    } catch (e) {
      setLoiDon(getErrorMessage(e));
      setDangTaoDon(false);
    }
  };

  const goMa = () => {
    setMa("");
    setMaCuaKhoa("");
    setGiam(0);
    setLanMa((n) => n + 1);
  };

  const doiMa = (maMoi: string, courseId: string, soTienGiam: number) => {
    setMa(maMoi);
    setMaCuaKhoa(courseId);
    setGiam(soTienGiam);
  };

  // Bo khoa DANG duoc giam ra khoi gio thi ma khong con cho de an - go luon.
  //
  // Lam ngay trong tay cam nut thay vi trong useEffect: effect chay SAU khi ve
  // lai, nen co mot nhip tong tien van tru phan giam cua mot khoa da bien mat.
  const boMon = (courseId: string) => {
    if (courseId === maCuaKhoa) goMa();
    bo(courseId);
  };

  const doSachHet = () => {
    goMa();
    doSach();
  };

  const tongCoin = gio.reduce(
    (t, m) => t + giaRaCoin(m.courseId === maCuaKhoa ? Math.max(0, m.gia - giam) : m.gia),
    0,
  );
  const duCoin = soDu !== null && soDu >= tongCoin;

  /**
   * Mua LAN LUOT tung khoa bang dung duong /coin/mua da co.
   *
   * KHONG viet mot duong "mua nhieu" rieng o may chu: duong mua mot khoa da xu
   * ly san thu tu tru coin / ghi danh / hoan lai khi hong, va da chay that mot
   * thoi gian. Viet lai logic tien cho gio hang la nhan doi cho co the sai,
   * doi lay mot phan mang nhanh hon chut it.
   *
   * Lan luot chu khong song song: chay song song thi vai lenh tru coin cung
   * doc mot so du, va nguoi dung co the mua qua so coin dang co.
   */
  const thanhToan = async () => {
    if (dangMua || gio.length === 0) return;

    setDangMua(true);
    setXong(false);

    const ttMoi: Record<string, CartItemStatus> = {};
    const loiMoi: Record<string, string> = {};

    for (const mon of gio) {
      setTrangThai({ ...ttMoi, [mon.courseId]: "dangMua" });

      try {
        // Chi gui ma kem DUNG khoa da duoc chon. Gui kem moi khoa thi khoa
        // dau an ma, cac khoa sau bi may chu tu choi vi moi nguoi mot luot -
        // va ca lenh mua do hong theo, du khoa do van mua duoc voi gia goc.
        await muaBangCoin(mon.courseId, mon.courseId === maCuaKhoa ? ma : undefined);
        ttMoi[mon.courseId] = "xong";
      } catch (e) {
        ttMoi[mon.courseId] = "hong";
        loiMoi[mon.courseId] = getErrorMessage(e);
      }

      setTrangThai({ ...ttMoi });
      setLoiTheoMon({ ...loiMoi });
    }

    // Chi bo khoi gio nhung mon DA mua duoc. Mon hong phai o lai de nguoi dung
    // thay vi sao no hong va thu lai - xoa het la ho khong con biet mon nao
    // chua mua duoc.
    for (const mon of gio) {
      if (ttMoi[mon.courseId] === "xong") bo(mon.courseId);
    }

    // Mua duoc khoa mang ma thi luot da bi tieu - giu ma tren man hinh nua la
    // moi nguoi dung bam lai mot lan chac chan hong.
    if (maCuaKhoa && ttMoi[maCuaKhoa] === "xong") goMa();

    setDangMua(false);
    setXong(true);

    // Cap nhat lai so du sau khi mua.
    layViCuaToi()
      .then((v) => setSoDu(v.soDuCoin))
      .catch(() => {});
  };

  const toiKhoaHocCuaToi = () => router.push(CART.myCoursesHref);

  return {
    gio,
    tongTien,
    soMon,
    user,
    dangTai,
    duongDangNhap,
    soDu,
    dangMua,
    trangThai,
    loiTheoMon,
    xong,
    giam,
    lanMa,
    dangTaoDon,
    loiDon,
    tongCoin,
    duCoin,
    thanhToanQR,
    doiMa,
    boMon,
    doSachHet,
    thanhToan,
    toiKhoaHocCuaToi,
  };
}

export type CartState = ReturnType<typeof useCart>;
