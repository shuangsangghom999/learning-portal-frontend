"use client";

import { useCallback, useEffect, useState } from "react";

import { khoaTuTenMon } from "@/src/components/document/fileInfo";
import { ADMIN_DOCUMENTS as C } from "@/src/constants/admin-documents";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  documentService,
  type DocumentSubject,
  type SharedDocument,
} from "@/src/services/document";

/**
 * Quan ly toan bo tai lieu do nguoi dung chia se.
 *
 * Quyen xoa da co san o may chu: deleteDocument cho qua khi la chu bai HOAC
 * role === 'admin'. Trang nay khong tu cap them quyen gi, chi bay ra cho admin
 * mot cho nhin duoc ca kho thay vi phai di tung trang chi tiet.
 */
export function useAdminDocuments() {
  const [danhSach, setDanhSach] = useState<SharedDocument[]>([]);
  const [tong, setTong] = useState(0);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [baoThanhCong, setBaoThanhCong] = useState<string | null>(null);

  // O tim: giu rieng voi tu khoa DANG AP DUNG. Goi API theo tung phim go thi
  // moi chu la mot luot goi; o day phai bam Tim (hoac Enter) moi goi.
  const [oTim, setOTim] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  const [dangXoa, setDangXoa] = useState<string | null>(null);
  const [hoiXoa, setHoiXoa] = useState<SharedDocument | null>(null);

  // Sua mon hoc ngay tren bang. Can cho tai lieu dang TRUOC khi co truong mon:
  // chung khong co mon nao nen khong bao gio duoc goi y "cung mon".
  // giaTriMon la mang KHOA mon (chon trong danh sach), khong phai chu go tu do.
  const [dsMon, setDsMon] = useState<DocumentSubject[]>([]);
  const [dangSuaMon, setDangSuaMon] = useState<string | null>(null);
  const [giaTriMon, setGiaTriMon] = useState<string[]>([]);
  const [dangLuuMon, setDangLuuMon] = useState(false);
  const [dangDoiAn, setDangDoiAn] = useState<string | null>(null);

  const batDauSuaMon = (d: SharedDocument) => {
    setDangSuaMon(d._id);
    // Tai lieu luu TEN mon chuan lay tu danh sach, nen so khop ten la ra khoa.
    setGiaTriMon(khoaTuTenMon(dsMon, d.monHoc));
  };

  const luuMon = async (d: SharedDocument) => {
    if (!giaTriMon.length) return setLoi(C.messages.needSubject);
    try {
      setDangLuuMon(true);
      setLoi(null);
      const { monHoc } = await documentService.updateDocument(d._id, {
        monHoc: giaTriMon,
      });
      // Cap nhat tai cho thay vi tai lai ca bang: giu nguyen vi tri cuon va
      // khong nhap nhay trong khi admin dang gan mon cho nhieu dong lien tiep.
      setDanhSach((ds) => ds.map((x) => (x._id === d._id ? { ...x, monHoc } : x)));
      setDangSuaMon(null);
      setBaoThanhCong(C.messages.subjectsSaved((monHoc ?? []).join(", "), d.title));
    } catch (err) {
      setLoi(getErrorMessage(err, C.messages.subjectsFailed));
    } finally {
      setDangLuuMon(false);
    }
  };

  const doiAn = async (d: SharedDocument) => {
    try {
      setDangDoiAn(d._id);
      setLoi(null);
      const { daAn } = await documentService.setHidden(d._id, !d.daAn);
      setDanhSach((ds) => ds.map((x) => (x._id === d._id ? { ...x, daAn } : x)));
      setBaoThanhCong(daAn ? C.messages.hidden(d.title) : C.messages.shown(d.title));
    } catch (err) {
      setLoi(getErrorMessage(err, C.messages.toggleFailed));
    } finally {
      setDangDoiAn(null);
    }
  };

  const taiDsMon = useCallback(async () => {
    try {
      setDsMon(await documentService.getSubjects());
    } catch {
      // Thieu danh sach thi chi khong gan mon duoc - bang van dung.
    }
  }, []);

  useEffect(() => {
    // Hoan mot vong microtask - xem ghi chu o effect tai danh sach ben duoi.
    void Promise.resolve().then(taiDsMon);
  }, [taiDsMon]);

  const tai = useCallback(async () => {
    try {
      setDangTai(true);
      setLoi(null);
      // Duong QUAN TRI: gom ca tai lieu da an. Duong cong khai khong bao gio
      // tra chung - an roi thi admin phai co cho de hien lai.
      const res = await documentService.getDocumentsAdmin({
        page: trang,
        limit: C.pageSize,
        q: tuKhoa,
      });
      setDanhSach(res.documents ?? []);
      setTong(res.total ?? 0);
      setTongTrang(res.totalPages || 1);
    } catch (err) {
      setLoi(getErrorMessage(err, C.messages.loadFailed));
    } finally {
      setDangTai(false);
    }
  }, [trang, tuKhoa]);

  useEffect(() => {
    // Goi qua mot vong microtask thay vi goi thang. Ham tai() bat dau bang
    // setDangTai(true), nen goi thang la setState dong bo ngay trong than
    // effect: React phai chay them mot vong ve lai truoc khi hien man hinh
    // (rule react-hooks/set-state-in-effect canh bao dung cho nay). Hoan mot
    // vong microtask thi mat thuong khong thay khac, ma vong ve thua het.
    void Promise.resolve().then(tai);
  }, [tai]);

  const xacNhanXoa = async () => {
    if (!hoiXoa) return;
    try {
      setDangXoa(hoiXoa._id);
      await documentService.deleteDocument(hoiXoa._id);
      setBaoThanhCong(C.messages.deleted(hoiXoa.title));
      setHoiXoa(null);

      // Xoa muc cuoi cung cua mot trang thi trang do thanh rong. Lui mot trang
      // thay vi de admin nhin mot bang trong roi tuong mat het du lieu.
      if (danhSach.length === 1 && trang > 1) setTrang((t) => t - 1);
      else await tai();
    } catch (err) {
      setLoi(getErrorMessage(err, C.messages.deleteFailed));
      setHoiXoa(null);
    } finally {
      setDangXoa(null);
    }
  };

  const timKiem = (e: React.FormEvent) => {
    e.preventDefault();
    setTrang(1); // ket qua moi thi phai ve trang 1, khong giu so trang cu
    setTuKhoa(oTim);
  };

  const xoaTim = () => {
    setOTim("");
    setTuKhoa("");
    setTrang(1);
  };

  const tongLuotTai = danhSach.reduce((s, d) => s + (d.downloadCount || 0), 0);
  const soChuaCoMon = danhSach.filter((d) => !d.monHoc?.length).length;

  return {
    danhSach,
    tong,
    trang,
    setTrang,
    tongTrang,
    dangTai,
    loi,
    baoThanhCong,
    dongBao: () => setBaoThanhCong(null),
    oTim,
    setOTim,
    tuKhoa,
    dangXoa,
    hoiXoa,
    setHoiXoa,
    dsMon,
    dangSuaMon,
    huySuaMon: () => setDangSuaMon(null),
    giaTriMon,
    setGiaTriMon,
    dangLuuMon,
    dangDoiAn,
    batDauSuaMon,
    luuMon,
    doiAn,
    xacNhanXoa,
    timKiem,
    xoaTim,
    tongLuotTai,
    soChuaCoMon,
  };
}

export type AdminDocumentsState = ReturnType<typeof useAdminDocuments>;
