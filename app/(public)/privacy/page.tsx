import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Legal & Privacy
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Privacy Policy & Data Security
        </h1>
        <p className="text-xs text-slate-500">
          Last Revised: November 2026 • Compliant with Indian Information Technology Act, 2000 & Digital Personal Data Protection Act (DPDP), 2023.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 text-xs text-slate-700 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">1. Professional Confidentiality Mandate</h2>
          <p>
            Dewangan &amp; Associates adheres to strict professional confidentiality standards. We do not disclose, sell, lease, or monetize client financial data, PAN numbers, bank statements, or tax computations to any third party under any circumstances.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">2. Information We Collect</h2>
          <p>
            In the ordinary course of professional engagement, we collect necessary compliance details including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Personal Identifiers: Name, Mobile, Email, PAN (Permanent Account Number), Aadhaar reference numbers.</li>
            <li>Corporate Records: Certificate of Incorporation, GSTINs, MOA/AOA, CIN, Director DINs.</li>
            <li>Financial Data: General ledgers, trial balances, bank statements, sales registers, vendor invoices, Form 26AS, AIS/TIS statements.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">3. Data Encryption & Storage Standards</h2>
          <p>
            All sensitive financial records stored in our CA Management ERP are encrypted at rest using industry-standard AES-256-GCM encryption. Data in transit is secured with TLS 1.3 encryption. Document downloads use time-limited HMAC-signed URLs that expire automatically after 15 minutes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">4. Data Retention & Archival</h2>
          <p>
            Under the Income Tax Act, 1961 (Section 149) and Companies Act, 2013 (Section 128), books of account and tax records must be retained for at least 8 to 10 financial years. We preserve encrypted archival backups in accordance with statutory limitation periods.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">5. Contact Our Data Protection Officer</h2>
          <p>
            For any queries regarding your data protection, please contact:
            <br />
            <strong>Compliance Officer:</strong> G. Dewangan & Associates, Bhilai, Durg, Chhattisgarh • Email: gajendradewangan@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
