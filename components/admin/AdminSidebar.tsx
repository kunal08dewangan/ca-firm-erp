"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Calculator,
  BookOpenCheck,
  Percent,
  ShieldCheck,
  Building,
  FolderLock,
  CheckSquare,
  Receipt,
  BarChart3,
  Settings,
  Calendar,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  // State for collapsible sub-menus
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    gst: pathname.startsWith("/admin/gst"),
    incomeTax: pathname.startsWith("/admin/income-tax"),
    accounting: pathname.startsWith("/admin/accounting"),
  });

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Website Leads & Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { title: "Clients & Entities", href: "/admin/clients", icon: Users },
    {
      title: "GST Management",
      icon: FileSpreadsheet,
      key: "gst",
      subItems: [
        { title: "Registrations & GSTINs", href: "/admin/gst/registrations" },
        { title: "Sales Register (Outward)", href: "/admin/gst/sales" },
        { title: "Purchase Register & ITC", href: "/admin/gst/purchases" },
        { title: "GSTR-1 & 3B Returns", href: "/admin/gst/returns" },
        { title: "GSTR-2B Reconciliation", href: "/admin/gst/recon-2b" },
        { title: "GST Calculator (RCM)", href: "/admin/gst/calculator" },
      ],
    },
    {
      title: "Income Tax & ITR",
      icon: Calculator,
      key: "incomeTax",
      subItems: [
        { title: "ITR Client Profiles", href: "/admin/income-tax/profiles" },
        { title: "Tax Computation (115BAC)", href: "/admin/income-tax/computation" },
        { title: "ITR Filing Tracker", href: "/admin/income-tax/filings" },
      ],
    },
    {
      title: "Accounting & Ledger",
      icon: BookOpenCheck,
      key: "accounting",
      subItems: [
        { title: "Chart of Accounts", href: "/admin/accounting/chart-of-accounts" },
        { title: "Vouchers (Balanced)", href: "/admin/accounting/vouchers" },
        { title: "General Ledger", href: "/admin/accounting/ledgers" },
        { title: "Trial Balance", href: "/admin/accounting/trial-balance" },
        { title: "P&L & Balance Sheet", href: "/admin/accounting/financial-statements" },
      ],
    },
    { title: "TDS / TCS Compliance", href: "/admin/tds-tcs", icon: Percent },
    { title: "Statutory & Tax Audit", href: "/admin/audit", icon: ShieldCheck },
    { title: "ROC & MCA Records", href: "/admin/roc", icon: Building },
    { title: "Document Vault", href: "/admin/documents", icon: FolderLock },
    { title: "Tasks & Deadlines", href: "/admin/tasks", icon: CheckSquare },
    { title: "Compliance Calendar", href: "/admin/calendar", icon: Calendar },
    { title: "Billing & Invoices", href: "/admin/invoices", icon: Receipt },
    { title: "Practice Reports", href: "/admin/reports", icon: BarChart3 },
    { title: "System & Audit Logs", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#17365D] text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
              CA
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white">
                DEWANGAN ERP
              </span>
              <span className="text-[10px] text-blue-200 font-medium">
                Practice Management
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.subItems) {
              const isSubActive = item.subItems.some((sub) => pathname.startsWith(sub.href));
              const isMenuOpen = !!openMenus[item.key!];

              return (
                <div key={item.title} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.key!)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isSubActive
                        ? "bg-white/10 text-white font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-blue-300" />
                      <span>{item.title}</span>
                    </div>
                    {isMenuOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {/* Submenu links */}
                  {isMenuOpen && (
                    <div className="pl-6 space-y-1 pt-0.5 pb-1 border-l border-white/10 ml-4">
                      {item.subItems.map((sub) => {
                        const isCurrent = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-3 py-1.5 text-[11px] rounded transition-colors ${
                              isCurrent
                                ? "bg-[#2563EB] text-white font-medium"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-[#2563EB] text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-blue-300" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Area with Website Link */}
        <div className="p-3 border-t border-white/10 shrink-0 text-xs text-slate-400">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <span className="text-[11px]">View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
