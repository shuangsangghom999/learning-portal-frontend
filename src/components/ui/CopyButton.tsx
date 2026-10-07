"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { COPY_TEXT } from "@/src/constants/common";

interface CopyButtonProps {
  /** Chuoi duoc chep vao clipboard. */
  value: string;
  /** Ten thu duoc chep, dung cho aria-label ("Sao chép số tài khoản"). */
  what: string;
  className?: string;
  /** Hien bieu tuong Copy / Check truoc chu. */
  withIcon?: boolean;
}

/**
 * Nut sao chep, tu doi thanh "Đã chép" trong 2 giay roi tra ve nhu cu.
 * Truoc day trang thanh toan va trang nap coin moi trang chep mot ban.
 */
export default function CopyButton({
  value,
  what,
  className,
  withIcon = false,
}: CopyButtonProps) {
  const [daChep, setDaChep] = useState(false);

  useEffect(() => {
    if (!daChep) return;
    const h = setTimeout(() => setDaChep(false), 2000);
    return () => clearTimeout(h);
  }, [daChep]);

  const chep = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDaChep(true);
    } catch {
      // Trinh duyet cu hoac trang khong chay https thi khong co clipboard API.
      // Khong bao loi: nguoi dung van boi den chu de chep tay duoc.
    }
  };

  return (
    <button
      type="button"
      onClick={chep}
      aria-label={COPY_TEXT.aria(what)}
      className={className}
    >
      {withIcon && (daChep ? <Check size={12} /> : <Copy size={12} />)}
      {daChep ? COPY_TEXT.copied : COPY_TEXT.copy}
    </button>
  );
}
