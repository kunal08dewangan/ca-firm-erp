import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "sales"; // "sales" or "purchases"
    const period = searchParams.get("period");

    let csvContent = "";

    if (type === "sales") {
      const sales = await db.gstSalesEntry.findMany({
        where: period && period !== "ALL" ? { gstr1Period: period } : {},
        orderBy: { invoiceDate: "desc" },
      });

      csvContent = "Invoice No,Invoice Date,Type,Customer Name,Customer GSTIN,POS,Supply Type,HSN,Taxable,GST Rate,CGST,SGST,IGST,Total Amount\n";
      for (const s of sales) {
        csvContent += `"${s.invoiceNumber}","${s.invoiceDate.toISOString().split("T")[0]}","${s.invoiceType}","${s.customerName}","${s.customerGstin || ""}","${s.placeOfSupply}","${s.supplyType}","${s.hsnCode || ""}",${s.taxableAmount},${s.gstRate},${s.cgstAmount},${s.sgstAmount},${s.igstAmount},${s.totalAmount}\n`;
      }
    } else {
      const purchases = await db.gstPurchaseEntry.findMany({
        where: period && period !== "ALL" ? { gstr2bPeriod: period } : {},
        orderBy: { invoiceDate: "desc" },
      });

      csvContent = "Invoice No,Invoice Date,Supplier Name,Supplier GSTIN,POS,Taxable,GST Rate,CGST,SGST,IGST,Total Amount,ITC Eligibility,2B Match\n";
      for (const p of purchases) {
        csvContent += `"${p.invoiceNumber}","${p.invoiceDate.toISOString().split("T")[0]}","${p.supplierName}","${p.supplierGstin}","${p.placeOfSupply}",${p.taxableAmount},${p.gstRate},${p.cgstAmount},${p.sgstAmount},${p.igstAmount},${p.totalAmount},"${p.itcEligibility}","${p.matchStatus || "PENDING"}"\n`;
      }
    }

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="GST_${type.toUpperCase()}_REGISTER_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
