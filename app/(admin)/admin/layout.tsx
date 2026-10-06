import { AdminShell } from "@/src/components/features/admin/layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
