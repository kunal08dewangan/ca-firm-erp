export interface VoucherEntryInput {
  accountId: string;
  accountName?: string;
  debit: number;
  credit: number;
  particulars?: string;
}

export interface VoucherValidationResult {
  isValid: boolean;
  totalDebit: number;
  totalCredit: number;
  difference: number;
  error?: string;
}

/**
 * Validates that a double-entry voucher has balanced debits and credits
 */
export function validateVoucher(entries: VoucherEntryInput[]): VoucherValidationResult {
  if (!entries || entries.length < 2) {
    return {
      isValid: false,
      totalDebit: 0,
      totalCredit: 0,
      difference: 0,
      error: "A double-entry voucher must contain at least two entries (one debit and one credit).",
    };
  }

  const totalDebit = Math.round(entries.reduce((acc, e) => acc + (Number(e.debit) || 0), 0) * 100) / 100;
  const totalCredit = Math.round(entries.reduce((acc, e) => acc + (Number(e.credit) || 0), 0) * 100) / 100;
  const difference = Math.round(Math.abs(totalDebit - totalCredit) * 100) / 100;

  if (totalDebit <= 0 || totalCredit <= 0) {
    return {
      isValid: false,
      totalDebit,
      totalCredit,
      difference,
      error: "Voucher amounts must be greater than zero.",
    };
  }

  if (difference > 0.01) {
    return {
      isValid: false,
      totalDebit,
      totalCredit,
      difference,
      error: `Voucher is unbalanced. Total Debits (₹${totalDebit}) must equal Total Credits (₹${totalCredit}). Difference: ₹${difference}.`,
    };
  }

  return {
    isValid: true,
    totalDebit,
    totalCredit,
    difference: 0,
  };
}

export interface TrialBalanceItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface TrialBalanceReport {
  items: TrialBalanceItem[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  difference: number;
}

/**
 * Computes Trial Balance from accounts and voucher entries
 */
export function computeTrialBalance(
  accounts: any[],
  voucherEntries: any[]
): TrialBalanceReport {
  const items: TrialBalanceItem[] = accounts.map((acct) => {
    const entries = voucherEntries.filter((e) => e.accountId === acct.id);
    const sumDebit = entries.reduce((acc, e) => acc + e.debit, 0);
    const sumCredit = entries.reduce((acc, e) => acc + e.credit, 0);

    const isDebitNormal = acct.accountType === "ASSET" || acct.accountType === "EXPENSE";
    let net = (acct.openingBalance || 0) + (isDebitNormal ? sumDebit - sumCredit : sumCredit - sumDebit);

    let closingDebit = 0;
    let closingCredit = 0;

    if (isDebitNormal) {
      if (net >= 0) {
        closingDebit = Math.round(net * 100) / 100;
      } else {
        closingCredit = Math.round(Math.abs(net) * 100) / 100;
      }
    } else {
      if (net >= 0) {
        closingCredit = Math.round(net * 100) / 100;
      } else {
        closingDebit = Math.round(Math.abs(net) * 100) / 100;
      }
    }

    return {
      accountId: acct.id,
      accountCode: acct.accountCode,
      accountName: acct.accountName,
      accountType: acct.accountType,
      openingBalance: acct.openingBalance || 0,
      totalDebit: sumDebit,
      totalCredit: sumCredit,
      closingDebit,
      closingCredit,
    };
  });

  const totalDebit = Math.round(items.reduce((acc, i) => acc + i.closingDebit, 0) * 100) / 100;
  const totalCredit = Math.round(items.reduce((acc, i) => acc + i.closingCredit, 0) * 100) / 100;
  const difference = Math.round(Math.abs(totalDebit - totalCredit) * 100) / 100;

  return {
    items,
    totalDebit,
    totalCredit,
    isBalanced: difference <= 0.01,
    difference,
  };
}

export interface FinancialStatementsReport {
  profitAndLoss: {
    revenueItems: TrialBalanceItem[];
    expenseItems: TrialBalanceItem[];
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
  };
  balanceSheet: {
    assetItems: TrialBalanceItem[];
    liabilityItems: TrialBalanceItem[];
    equityItems: TrialBalanceItem[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    isBalanced: boolean;
  };
}

/**
 * Computes Profit & Loss and Balance Sheet from Trial Balance items
 */
export function computeFinancialStatements(trialBalanceItems: TrialBalanceItem[]): FinancialStatementsReport {
  const revenueItems = trialBalanceItems.filter((i) => i.accountType === "REVENUE");
  const expenseItems = trialBalanceItems.filter((i) => i.accountType === "EXPENSE");
  const assetItems = trialBalanceItems.filter((i) => i.accountType === "ASSET");
  const liabilityItems = trialBalanceItems.filter((i) => i.accountType === "LIABILITY");
  const equityItems = trialBalanceItems.filter((i) => i.accountType === "EQUITY");

  const totalRevenue = revenueItems.reduce((acc, i) => acc + (i.closingCredit - i.closingDebit), 0);
  const totalExpense = expenseItems.reduce((acc, i) => acc + (i.closingDebit - i.closingCredit), 0);
  const netProfit = totalRevenue - totalExpense;

  const totalAssets = assetItems.reduce((acc, i) => acc + (i.closingDebit - i.closingCredit), 0);
  const totalLiabilities = liabilityItems.reduce((acc, i) => acc + (i.closingCredit - i.closingDebit), 0);
  const baseEquity = equityItems.reduce((acc, i) => acc + (i.closingCredit - i.closingDebit), 0);
  const totalEquity = baseEquity + netProfit; // Add Net Profit to Equity

  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) <= 1.0;

  return {
    profitAndLoss: {
      revenueItems,
      expenseItems,
      totalRevenue,
      totalExpense,
      netProfit,
    },
    balanceSheet: {
      assetItems,
      liabilityItems,
      equityItems,
      totalAssets,
      totalLiabilities,
      totalEquity,
      isBalanced,
    },
  };
}
