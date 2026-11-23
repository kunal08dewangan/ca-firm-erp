"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Menu,
  X,
  Phone,
  Mail,
  Calendar,
  Lock,
  ChevronDown,
} from "lucide-react";
import { FIRM_CONFIG } from "@/lib/firm-config";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  const services = [
    { title: "GST Advisory & Filings", href: "/services/gst" },
    { title: "Income Tax & ITR", href: "/services/income-tax" },
    { title: "Accounting & Bookkeeping", href: "/services/accounting" },
    { title: "Statutory & Tax Audit", href: "/services/audit" },
    { title: "Company & LLP Registration", href: "/services/company-registration" },
    { title: "TDS & TCS Compliance", href: "/services/tds-tcs" },
  ];

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Services", href: "/services", hasSub: true },
    { title: "Blog & Updates", href: "/blog" },
    { title: "FAQ", href: "/faq" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      {/* Top Corporate Strip */}
      <div className="bg-[#17365D] text-white text-xs py-2 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a href={`mailto:${FIRM_CONFIG.email}`} className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition">
            <Mail className="w-3.5 h-3.5 text-blue-300" />
            {FIRM_CONFIG.email}
          </a>
          <a href={`tel:${FIRM_CONFIG.phone}`} className="hidden sm:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition">
            <Phone className="w-3.5 h-3.5 text-blue-300" />
            {FIRM_CONFIG.phone}
          </a>
          <span className="hidden md:inline-block text-blue-200 text-[11px]">
            Taxation &amp; GST Compliance Services
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin-login"
            className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors font-medium px-2 py-0.5 rounded hover:bg-white/10"
          >
            <Lock className="w-3 h-3 text-amber-300" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-[#17365D] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#2563EB] transition-colors">
            DA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-[#17365D] group-hover:text-[#2563EB] transition-colors">
              {FIRM_CONFIG.firmName}
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
              Tax &amp; Financial Consultants
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            if (link.hasSub) {
              return (
                <div
                  key={link.title}
                  className="relative group"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 py-2 hover:text-[#2563EB] transition-colors ${
                      pathname.startsWith("/services") ? "text-[#2563EB] font-semibold" : ""
                    }`}
                  >
                    {link.title}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                  </Link>

                  {/* Dropdown Menu */}
                  {servicesOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-1">
                      {services.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2563EB] transition-colors"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.title}
                href={link.href}
                className={`py-2 transition-colors hover:text-[#2563EB] ${
                  isActive ? "text-[#2563EB] font-semibold border-b-2 border-[#2563EB]" : ""
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Actions Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/book-appointment"
            className="flex items-center gap-2 bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Consultation
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md font-medium ${
                  pathname === link.href ? "bg-blue-50 text-[#2563EB]" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.title}
              </Link>
            ))}

            {/* Mobile Service Sub-links */}
            <div className="pl-4 border-l-2 border-blue-100 space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-2">
                Specialized Services
              </span>
              {services.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-1.5 text-xs text-slate-600 hover:text-[#2563EB]"
                >
                  {sub.title}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/book-appointment"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded shadow-sm"
              >
                Book Consultation
              </Link>
              <Link
                href="/admin-login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center border border-slate-300 text-slate-700 text-xs font-medium py-2 rounded hover:bg-slate-50"
              >
                Admin Portal Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
