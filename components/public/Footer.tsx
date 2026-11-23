import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { FIRM_CONFIG } from "@/lib/firm-config";

export default function Footer() {
  return (
    <footer className="bg-[#17365D] text-slate-200 border-t border-slate-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Firm Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg">
                DA
              </div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">{FIRM_CONFIG.firmName}</h3>
                <p className="text-xs text-blue-200">Tax &amp; Financial Consultants</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Professional Tax &amp; Accounting Consultancy delivering corporate taxation, comprehensive GST compliance, bookkeeping, and business advisory.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-200 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tax &amp; Compliance Advisory</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 border-b border-slate-700 pb-2">
              Practice Areas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/gst" className="hover:text-white hover:underline transition-colors">
                  GST Registration & Returns
                </Link>
              </li>
              <li>
                <Link href="/services/income-tax" className="hover:text-white hover:underline transition-colors">
                  Corporate & Personal Tax (ITR)
                </Link>
              </li>
              <li>
                <Link href="/services/audit" className="hover:text-white hover:underline transition-colors">
                  Statutory & Tax Audit (u/s 44AB)
                </Link>
              </li>
              <li>
                <Link href="/services/accounting" className="hover:text-white hover:underline transition-colors">
                  Bookkeeping & Virtual CFO
                </Link>
              </li>
              <li>
                <Link href="/services/company-registration" className="hover:text-white hover:underline transition-colors">
                  Pvt Ltd / LLP Incorporation
                </Link>
              </li>
              <li>
                <Link href="/services/tds-tcs" className="hover:text-white hover:underline transition-colors">
                  TDS Returns (24Q / 26Q) & Challans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 border-b border-slate-700 pb-2">
              Firm & Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition-colors">
                  About the Partners
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-white hover:underline transition-colors">
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white hover:underline transition-colors">
                  Tax Updates & Circulars
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:underline transition-colors">
                  Tax FAQ & Due Dates
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:underline transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:underline transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin-login" className="text-amber-300 hover:text-white transition-colors font-medium">
                  CA Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 border-b border-slate-700 pb-2">
              Office Address
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <span>
                  {FIRM_CONFIG.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-300 shrink-0" />
                <span>{FIRM_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <span>{FIRM_CONFIG.email}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                <p>Office Hours: Mon - Sat: 9:30 AM - 6:30 PM</p>
                <p className="text-emerald-400">Statutory Tax &amp; GST Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Disclaimer & Copyright Strip */}
      <div className="bg-[#0F243E] border-t border-slate-800 text-slate-400 text-[11px] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> Professional Tax, GST, and Accounting Consultancy services provided for businesses, traders, professionals, and individuals. All statutory filings and compliances are handled in accordance with prevailing Indian tax laws.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} {FIRM_CONFIG.firmName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
