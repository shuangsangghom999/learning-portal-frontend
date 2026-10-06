"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_DOCUMENT_SUBJECTS as C } from "@/src/constants/admin-document-subjects";
import { getErrorMessage } from "@/src/services/apiHelper";
import {
  documentService,
  type BieuTuongLinhVuc,
  type DocumentCategory,
  type DocumentSubject,
  type DocumentUniversity,
} from "@/src/services/document";

const M = C.messages;
const theoTen = (a: DocumentSubject, b: DocumentSubject) =>
  a.ten.localeCompare(b.ten, "vi");

/**
 * Mon hoc va LINH VUC (va truong) cua kho tai lieu chia se.
 *
 * - Linh vuc: nhom lon (Luat, Kinh doanh...) - hien thanh cac o o trang
 *   /share-document.
 * - Mon: nguoi dang tai lieu chi CHON trong danh sach nay. Moi mon xep vao toi
 *   da mot linh vuc.
 *
 * Rieng cho kho tai lieu, khong dinh vao danh muc cua khoa hoc.
 */
export function useDocumentCatalog() {
  const [ds, setDs] = useState<DocumentSubject[]>([]);
  const [dsNhom, setDsNhom] = useState<DocumentCategory[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [tenMoi, setTenMoi] = useState("");
  const [dangThem, setDangThem] = useState(false);

  const [dangSua, setDangSua] = useState<string | null>(null);
  const [tenSua, setTenSua] = useState("");
  const [dangLuu, setDangLuu] = useState(false);
  const [dangXoa, setDangXoa] = useState<string | null>(null);

  // Linh vuc
  const [tenNhomMoi, setTenNhomMoi] = useState("");
  const [bieuTuongMoi, setBieuTuongMoi] = useState<BieuTuongLinhVuc>("sach");
  const [dangThemNhom, setDangThemNhom] = useState(false);
  const [suaNhom, setSuaNhom] = useState<string | null>(null);
  const [tenNhomSua, setTenNhomSua] = useState("");

  // Truong dai hoc
  const [dsTruong, setDsTruong] = useState<DocumentUniversity[]>([]);
  const [tenTruongMoi, setTenTruongMoi] = useState("");
  const [suaTruong, setSuaTruong] = useState<string | null>(null);
  const [tenTruongSua, setTenTruongSua] = useState("");
  const [logoSua, setLogoSua] = useState("");

  const tai = useCallback(async () => {
    try {
      setDangTai(true);
      setLoi(null);
      const [mon, nhom, truong] = await Promise.all([
        documentService.getSubjects(),
        documentService.getCategories(),
        documentService.getUniversities(),
      ]);
      setDs(mon);
      setDsNhom(nhom);
      setDsTruong(truong);
    } catch (err) {
      setLoi(getErrorMessage(err, M.loadFailed));
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    // Hoan mot vong microtask, tranh setState dong bo trong than effect
    // (react-hooks/set-state-in-effect).
    void Promise.resolve().then(tai);
  }, [tai]);

  // ------------------------------------------------------------- linh vuc

  const themNhom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenNhomMoi.trim()) return;
    try {
      setDangThemNhom(true);
      setLoi(null);
      const n = await documentService.createCategory({
        ten: tenNhomMoi,
        bieuTuong: bieuTuongMoi,
      });
      setDsNhom((cu) => [...cu, n]);
      setTenNhomMoi("");
      setOk(M.categoryAdded(n.ten));
    } catch (err) {
      setLoi(getErrorMessage(err, M.categoryAddFailed));
    } finally {
      setDangThemNhom(false);
    }
  };

  const capNhatNhom = async (
    n: DocumentCategory,
    data: { ten?: string; bieuTuong?: BieuTuongLinhVuc },
  ) => {
    try {
      setLoi(null);
      const moi = await documentService.updateCategory(n._id, data);
      setDsNhom((cu) =>
        cu.map((x) =>
          x._id === n._id
            ? { ...x, ten: moi.ten, key: moi.key, bieuTuong: moi.bieuTuong }
            : x,
        ),
      );
      setSuaNhom(null);
      setOk(M.categoryUpdated(moi.ten));
    } catch (err) {
      setLoi(getErrorMessage(err, M.categoryUpdateFailed));
    }
  };

  const batDauSuaNhom = (n: DocumentCategory) => {
    setSuaNhom(n._id);
    setTenNhomSua(n.ten);
  };

  const xoaNhom = async (n: DocumentCategory) => {
    if (!confirm(M.confirmDeleteCategory(n.ten, n.soMon))) return;
    try {
      setLoi(null);
      await documentService.deleteCategory(n._id);
      setDsNhom((cu) => cu.filter((x) => x._id !== n._id));
      setDs((cu) => cu.map((m) => (m.nhom === n._id ? { ...m, nhom: null } : m)));
      setOk(M.categoryDeleted(n.ten));
    } catch (err) {
      setLoi(getErrorMessage(err, M.categoryDeleteFailed));
    }
  };

  const xepMon = async (m: DocumentSubject, nhom: string) => {
    try {
      setLoi(null);
      await documentService.setSubjectCategory(m._id, nhom || null);
      setDs((cu) => cu.map((x) => (x._id === m._id ? { ...x, nhom: nhom || null } : x)));
      // So mon cua moi linh vuc tren man hinh doi theo ngay.
      setDsNhom((cu) =>
        cu.map((n) => ({
          ...n,
          soMon: n.soMon + (n._id === nhom ? 1 : 0) - (n._id === m.nhom ? 1 : 0),
        })),
      );
      const ten = dsNhom.find((n) => n._id === nhom)?.ten;
      setOk(ten ? M.subjectPlaced(m.ten, ten) : M.subjectUnplaced(m.ten));
    } catch (err) {
      setLoi(getErrorMessage(err, M.subjectPlaceFailed));
    }
  };

  // ------------------------------------------------------------- truong

  const themTruong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenTruongMoi.trim()) return;
    try {
      setLoi(null);
      const t = await documentService.createUniversity(tenTruongMoi);
      setDsTruong((cu) => [...cu, t]);
      setTenTruongMoi("");
      setOk(M.universityAdded(t.ten));
    } catch (err) {
      setLoi(getErrorMessage(err, M.universityAddFailed));
    }
  };

  const batDauSuaTruong = (t: DocumentUniversity) => {
    setSuaTruong(t._id);
    setTenTruongSua(t.ten);
    setLogoSua(t.logo ?? "");
  };

  const doiTenTruong = async (t: DocumentUniversity) => {
    try {
      setLoi(null);
      // Logo doi thi luu logo truoc (kiem o may chu: /images/institution/... hoac https).
      if (logoSua.trim() !== (t.logo ?? "")) {
        const coLogo = await documentService.setUniversityLogo(t._id, logoSua.trim());
        setDsTruong((cu) =>
          cu.map((x) => (x._id === t._id ? { ...x, logo: coLogo.logo } : x)),
        );
      }
      if (!tenTruongSua.trim() || tenTruongSua.trim() === t.ten) {
        setSuaTruong(null);
        setOk(M.universityUpdated(t.ten));
        return;
      }
      const moi = await documentService.renameUniversity(t._id, tenTruongSua);
      setDsTruong((cu) =>
        cu.map((x) => (x._id === t._id ? { ...x, ten: moi.ten, key: moi.key } : x)),
      );
      setSuaTruong(null);
      setOk(
        moi.soTaiLieuDaCapNhat > 0
          ? M.renamedWithDocs(moi.ten, moi.soTaiLieuDaCapNhat)
          : M.renamed(moi.ten),
      );
    } catch (err) {
      setLoi(getErrorMessage(err, M.universityRenameFailed));
    }
  };

  const xoaTruong = async (t: DocumentUniversity) => {
    if (!confirm(M.confirmDeleteUniversity(t.ten, t.soTaiLieu))) return;
    try {
      setLoi(null);
      await documentService.deleteUniversity(t._id);
      setDsTruong((cu) => cu.filter((x) => x._id !== t._id));
      setOk(M.universityDeleted(t.ten));
    } catch (err) {
      setLoi(getErrorMessage(err, M.universityDeleteFailed));
    }
  };

  // ------------------------------------------------------------- mon hoc

  const them = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenMoi.trim()) return;
    try {
      setDangThem(true);
      setLoi(null);
      const mon = await documentService.createSubject(tenMoi);
      setDs((cu) => [...cu, mon].sort(theoTen));
      setTenMoi("");
      setOk(M.subjectAdded(mon.ten));
    } catch (err) {
      // 409 = trung mon da co (ke ca khac dau/hoa thuong) - may chu noi ro.
      setLoi(getErrorMessage(err, M.subjectAddFailed));
    } finally {
      setDangThem(false);
    }
  };

  const batDauSuaMon = (m: DocumentSubject) => {
    setDangSua(m._id);
    setTenSua(m.ten);
  };

  const luuTen = async (m: DocumentSubject) => {
    if (!tenSua.trim() || tenSua.trim() === m.ten) return setDangSua(null);
    try {
      setDangLuu(true);
      setLoi(null);
      const moi = await documentService.renameSubject(m._id, tenSua);
      setDs((cu) =>
        cu
          .map((x) => (x._id === m._id ? { ...x, ten: moi.ten, key: moi.key } : x))
          .sort(theoTen),
      );
      setDangSua(null);
      // Noi ro ca tai lieu cung doi theo: admin can biet doi ten mon khong chi
      // la sua mot dong trong danh sach nay.
      setOk(
        moi.soTaiLieuDaCapNhat > 0
          ? M.subjectRenamedWithDocs(moi.ten, moi.soTaiLieuDaCapNhat)
          : M.renamed(moi.ten),
      );
    } catch (err) {
      setLoi(getErrorMessage(err, M.subjectRenameFailed));
    } finally {
      setDangLuu(false);
    }
  };

  const xoa = async (m: DocumentSubject) => {
    if (!confirm(M.confirmDeleteSubject(m.ten))) return;
    try {
      setDangXoa(m._id);
      setLoi(null);
      await documentService.deleteSubject(m._id);
      setDs((cu) => cu.filter((x) => x._id !== m._id));
      setOk(M.subjectDeleted(m.ten));
    } catch (err) {
      // 409 = con tai lieu dung mon nay - may chu noi ro so luong va cach xu ly.
      setLoi(getErrorMessage(err, M.subjectDeleteFailed));
    } finally {
      setDangXoa(null);
    }
  };

  return {
    dangTai,
    loi,
    setLoi,
    ok,
    setOk,
    // linh vuc
    dsNhom,
    tenNhomMoi,
    setTenNhomMoi,
    bieuTuongMoi,
    setBieuTuongMoi,
    dangThemNhom,
    suaNhom,
    setSuaNhom,
    tenNhomSua,
    setTenNhomSua,
    themNhom,
    capNhatNhom,
    batDauSuaNhom,
    xoaNhom,
    // truong
    dsTruong,
    tenTruongMoi,
    setTenTruongMoi,
    suaTruong,
    setSuaTruong,
    tenTruongSua,
    setTenTruongSua,
    logoSua,
    setLogoSua,
    themTruong,
    batDauSuaTruong,
    doiTenTruong,
    xoaTruong,
    // mon
    ds,
    tenMoi,
    setTenMoi,
    dangThem,
    dangSua,
    setDangSua,
    tenSua,
    setTenSua,
    dangLuu,
    dangXoa,
    them,
    batDauSuaMon,
    luuTen,
    xepMon,
    xoa,
  };
}

export type DocumentCatalogState = ReturnType<typeof useDocumentCatalog>;
