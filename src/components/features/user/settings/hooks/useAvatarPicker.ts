"use client";

import { useEffect, useState } from "react";

import { doiKichThuoc } from "@/src/components/document/fileInfo";
import { MAX_ANH_MB, MIME_ANH, USER_SETTINGS } from "@/src/constants/user-settings";

const A = USER_SETTINGS.personal.avatar;

/** Chon file anh (kiem truoc tren trinh duyet) hoac dan duong dan anh. */
export function useAvatarPicker(avatarBanDau: string) {
  const [avatar, setAvatar] = useState(avatarBanDau);
  const [anhChon, setAnhChon] = useState<File | null>(null);
  const [xemTruoc, setXemTruoc] = useState("");
  const [loiAnh, setLoiAnh] = useState("");

  // Doi hoac roi trang -> tra lai bo nho cua anh xem truoc. Khong lam thi moi
  // lan chon anh khac lai bo lai mot blob trong bo nho tab.
  useEffect(() => {
    if (!xemTruoc) return;
    return () => URL.revokeObjectURL(xemTruoc);
  }, [xemTruoc]);

  // Kiem ngay tren trinh duyet bang dung mot bo luat voi may chu, de nguoi
  // dung biet lien thay vi cho tai het 5MB roi moi bi tu choi.
  const chonAnh = (f: File | null) => {
    setLoiAnh("");
    setAnhChon(null);
    setXemTruoc("");
    if (!f) return;

    if (!MIME_ANH.includes(f.type)) {
      setLoiAnh(A.badType);
      return;
    }
    if (f.size > MAX_ANH_MB * 1024 * 1024) {
      setLoiAnh(A.tooBig(MAX_ANH_MB, doiKichThuoc(f.size)));
      return;
    }

    setAnhChon(f);
    setXemTruoc(URL.createObjectURL(f));
  };

  return { avatar, setAvatar, anhChon, xemTruoc, loiAnh, chonAnh };
}

export type AvatarPicker = ReturnType<typeof useAvatarPicker>;
