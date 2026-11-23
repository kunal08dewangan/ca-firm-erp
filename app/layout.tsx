import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "G. Dewangan & Associates | Chartered Accountants",
  description:
    "Premier Chartered Accountancy Firm offering Corporate Tax Advisory, GST Compliance, Statutory & Tax Audits, MCA Filings, and Virtual CFO Services.",
  keywords:
    "Chartered Accountant, CA Firm Bhilai, GST Filing, Income Tax Return, ITR Filing, Statutory Audit, Tax Audit, Company Registration, Accounting Services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-secondary selection:text-white">
        {children}
      </body>
    </html>
  );
}
