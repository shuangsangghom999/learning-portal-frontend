import { DE_LUYEN_TAP } from "@/src/components/practice/practiceData";

/** De luyen tap theo id; undefined khi khong co (trang goi notFound()). */
export const timDe = (id: string) => DE_LUYEN_TAP.find((d) => d.id === id);

// De la du lieu tinh nen dung san tung trang luc build. Ba trang /practice/[id]
// (gioi thieu, lam bai, ket qua) dung chung danh sach tham so nay.
export const thamSoMoiDe = () => DE_LUYEN_TAP.map((d) => ({ id: d.id }));
