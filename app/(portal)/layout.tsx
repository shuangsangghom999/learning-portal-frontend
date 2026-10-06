import { Be_Vietnam_Pro, Lexend } from "next/font/google";
import "../globals.css";

import { PortalShell, portalShellStyles } from "@/src/components/features/portal/layout";
import { PORTAL_LAYOUT } from "@/src/constants/portal-layout";

// Hai bo chu nay CHI nap o khu vuc hoc vien. Trang quan tri co layout rieng
// va khong dat hai bien nay, nen no van dung Inter nhu cu - doi giao dien
// trang chu khong keo theo viec doi mau va chu cua ca trang admin.
//
// Be Vietnam Pro: bo chu ve rieng cho dau tieng Viet. Dau mu, dau nga, chu
// "ữ" "ỗ" "ế" trong cac bo chu he thong thuong bi ghep tu font khac nen dat
// lech va nang nhe khong deu.
const chuThan = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600"],
  variable: "--chu-than",
  display: "swap",
});

// Lexend: ve ra de tang toc do doc, co nghien cuu kem theo. Dung cho tieu de.
const chuHien = Lexend({
  subsets: ["vietnamese", "latin"],
  weight: ["500", "700", "800"],
  variable: "--chu-hien",
  display: "swap",
});

// <html>/<body> va font phai nam o root layout nen giu lai day; phan con lai
// (header, footer, hop dang nhap...) nam trong PortalShell.
export default function PortalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={PORTAL_LAYOUT.lang}
      className={`${chuThan.variable} ${chuHien.variable}`}
      suppressHydrationWarning
    >
      <body className={portalShellStyles.box}>
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
