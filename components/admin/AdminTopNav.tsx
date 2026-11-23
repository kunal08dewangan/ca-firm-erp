"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  PlusCircle,
} from "lucide-react";

interface TopNavProps {
  setMobileOpen: (open: boolean) => void;
  admin: {
    fullName: string;
    email: string;
    membershipNo?: string | null;
    role: string;
  };
}

export default function AdminTopNav({ setMobileOpen, admin }: TopNavProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin-login");
      router.refresh();
    } catch {
      router.push("/admin-login");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/clients?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Universal Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            placeholder="Search by PAN, Client Name, GSTIN, or Invoice No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Right: Quick Actions, Alerts, CA Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Action Pill */}
        <Link
          href="/admin/clients"
          className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-[#17365D] hover:bg-blue-100 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>New Entry</span>
        </Link>

        {/* Assessment Year Tag */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded">
          <span>AY 2026-27</span>
          <span className="text-emerald-500">•</span>
          <span>FY 2025-26</span>
        </div>

        {/* CA Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs">
              DA
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {admin.fullName || "Gajendra Dewangan"}
              </span>
              <span className="text-[10px] text-slate-500">
                Dewangan &amp; Associates
              </span>
            </div>
          </button>

          {/* Profile Popover */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100 text-xs">
                <p className="font-bold text-slate-800">{admin.fullName}</p>
                <p className="text-slate-500 text-[11px]">{admin.email}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Authorized Administrator</span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Account & 2FA Settings
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Audit Trail Logs
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out from ERP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
