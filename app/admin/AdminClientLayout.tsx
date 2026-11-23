"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopNav from "@/components/admin/AdminTopNav";

export default function AdminClientLayout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: {
    fullName: string;
    email: string;
    membershipNo?: string | null;
    role: string;
  };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      {/* Fixed Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Body Area (Pushed 256px on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <AdminTopNav setMobileOpen={setMobileOpen} admin={admin} />

        {/* Vertically scrollable content workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
