export interface GstCalculationInput {
  supplierStateCode: string;
  placeOfSupplyStateCode: string;
  taxableAmount: number;
  gstRate: number; // e.g. 5, 12, 18, 28
  isRcm?: boolean;
}

export interface GstCalculationResult {
  supplyType: "INTRA_STATE" | "INTER_STATE";
  taxableAmount: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
  isRcm: boolean;
}

/**
 * Calculates Indian GST tax split based on Place of Supply (POS) rules
 */
export function calculateGst(input: GstCalculationInput): GstCalculationResult {
  const taxable = Math.round(Number(input.taxableAmount) * 100) / 100;
  const rate = Number(input.gstRate);
  const isRcm = Boolean(input.isRcm);

  const supplierState = String(input.supplierStateCode).padStart(2, "0");
  const posState = String(input.placeOfSupplyStateCode).padStart(2, "0");

  const isIntraState = supplierState === posState;

  if (isIntraState) {
    const halfRate = rate / 2;
    const cgst = Math.round(((taxable * halfRate) / 100) * 100) / 100;
    const sgst = Math.round(((taxable * halfRate) / 100) * 100) / 100;
    const totalTax = Math.round((cgst + sgst) * 100) / 100;
    const totalAmount = Math.round((taxable + totalTax) * 100) / 100;

    return {
      supplyType: "INTRA_STATE",
      taxableAmount: taxable,
      gstRate: rate,
      cgstRate: halfRate,
      cgstAmount: cgst,
      sgstRate: halfRate,
      sgstAmount: sgst,
      igstRate: 0,
      igstAmount: 0,
      totalTax,
      totalAmount,
      isRcm,
    };
  } else {
    const igst = Math.round(((taxable * rate) / 100) * 100) / 100;
    const totalAmount = Math.round((taxable + igst) * 100) / 100;

    return {
      supplyType: "INTER_STATE",
      taxableAmount: taxable,
      gstRate: rate,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: rate,
      igstAmount: igst,
      totalTax: igst,
      totalAmount,
      isRcm,
    };
  }
}

/**
 * Validates whether an ITC claim is blocked under Section 17(5) of the CGST Act
 */
export function isSection17_5Blocked(categoryOrHsn: string): { isBlocked: boolean; reason?: string } {
  const lower = categoryOrHsn.toLowerCase();

  if (
    lower.includes("motor vehicle") ||
    lower.includes("car") ||
    lower.includes("conveyance")
  ) {
    return {
      isBlocked: true,
      reason: "Motor vehicles for transport of persons (seating capacity <= 13) are blocked u/s 17(5)(a).",
    };
  }

  if (
    lower.includes("food") ||
    lower.includes("catering") ||
    lower.includes("beverage") ||
    lower.includes("restaurant")
  ) {
    return {
      isBlocked: true,
      reason: "Food, beverages, outdoor catering, and beauty treatment are blocked u/s 17(5)(b)(i).",
    };
  }

  if (lower.includes("club") || lower.includes("fitness") || lower.includes("gym")) {
    return {
      isBlocked: true,
      reason: "Membership of a club, health, and fitness centre is blocked u/s 17(5)(b)(ii).",
    };
  }

  if (lower.includes("works contract") || lower.includes("immovable property")) {
    return {
      isBlocked: true,
      reason: "Works contract services for construction of immovable property are blocked u/s 17(5)(c).",
    };
  }

  if (lower.includes("personal") || lower.includes("gift") || lower.includes("sample")) {
    return {
      isBlocked: true,
      reason: "Goods or services used for personal consumption, or given as gift/sample, are blocked u/s 17(5)(g)/(h).",
    };
  }

  return { isBlocked: false };
}

export interface PurchaseRecord {
  id: string;
  supplierGstin: string;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string | Date;
  taxableAmount: number;
  totalTax: number;
}

export interface Gstr2bRecord {
  gstin: string;
  tradeName: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableAmount: number;
  totalTax: number;
}

export interface ReconciliationReport {
  exactMatches: { books: PurchaseRecord; gstr2b: Gstr2bRecord }[];
  amountMismatches: { books: PurchaseRecord; gstr2b: Gstr2bRecord; difference: number }[];
  missingInBooks: Gstr2bRecord[];
  missingIn2B: PurchaseRecord[];
  summary: {
    totalBooksItc: number;
    total2bItc: number;
    eligibleMatchedItc: number;
    atRiskItc: number;
  };
}

/**
 * 4-Bucket GSTR-2B Automated Reconciliation Algorithm
 */
export function reconcileGstr2B(
  booksPurchases: PurchaseRecord[],
  gstr2bList: Gstr2bRecord[]
): ReconciliationReport {
  const exactMatches: { books: PurchaseRecord; gstr2b: Gstr2bRecord }[] = [];
  const amountMismatches: { books: PurchaseRecord; gstr2b: Gstr2bRecord; difference: number }[] = [];
  const matched2BIndices = new Set<number>();
  const matchedBookIds = new Set<string>();

  for (const book of booksPurchases) {
    const cleanBookInv = book.invoiceNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanBookGstin = book.supplierGstin.trim().toUpperCase();

    let foundIndex = -1;

    for (let i = 0; i < gstr2bList.length; i++) {
      if (matched2BIndices.has(i)) continue;

      const g2b = gstr2bList[i];
      const clean2bInv = g2b.invoiceNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      const clean2bGstin = g2b.gstin.trim().toUpperCase();

      if (cleanBookGstin === clean2bGstin && cleanBookInv === clean2bInv) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      const g2b = gstr2bList[foundIndex];
      matched2BIndices.add(foundIndex);
      matchedBookIds.add(book.id);

      const diff = Math.abs(book.taxableAmount - g2b.taxableAmount);
      if (diff <= 1.0) {
        exactMatches.push({ books: book, gstr2b: g2b });
      } else {
        amountMismatches.push({ books: book, gstr2b: g2b, difference: diff });
      }
    }
  }

  const missingIn2B = booksPurchases.filter((b) => !matchedBookIds.has(b.id));
  const missingInBooks = gstr2bList.filter((_, idx) => !matched2BIndices.has(idx));

  const totalBooksItc = booksPurchases.reduce((acc, b) => acc + b.totalTax, 0);
  const total2bItc = gstr2bList.reduce((acc, g) => acc + g.totalTax, 0);
  const eligibleMatchedItc = exactMatches.reduce((acc, m) => acc + m.books.totalTax, 0);
  const atRiskItc = missingIn2B.reduce((acc, b) => acc + b.totalTax, 0);

  return {
    exactMatches,
    amountMismatches,
    missingInBooks,
    missingIn2B,
    summary: {
      totalBooksItc,
      total2bItc,
      eligibleMatchedItc,
      atRiskItc,
    },
  };
}
