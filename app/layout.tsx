import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dewangan & Associates | Tax, GST & Accounting Advisory",
  description:
    "Premier Tax & Accounting Consultancy offering Corporate Tax Advisory, GST Compliance, Bookkeeping, Financial Statements, ROC Filings, and Business Advisory.",
  keywords:
    "Tax Consultant, GST Filing, Income Tax Return, ITR Filing, Accounting Services, Bhilai, Chhattisgarh, Business Registration, TDS Compliance",
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
