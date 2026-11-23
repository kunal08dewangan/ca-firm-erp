import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import AdminClientLayout from "./AdminClientLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin-login");
  }

  return (
    <AdminClientLayout admin={admin}>
      {children}
    </AdminClientLayout>
  );
}
