export interface IncomeDetails {
  // 1. Salary
  grossSalary?: number;
  salaryExemptions?: number; // Section 10 exemptions (HRA, LTA)

  // 2. House Property
  rentalIncome?: number;
  municipalTaxes?: number;
  homeLoanInterestSelfOccupied?: number; // Section 24(b)

  // 3. Business & Profession
  businessTurnover?: number;
  netBusinessProfit?: number;

  // 4. Capital Gains
  stcgNormal?: number;
  stcg111A?: number; // Listed shares @ 15% / 20%
  ltcgNormal?: number; // Real estate / others @ 20%
  ltcg112A?: number; // Listed equity beyond ₹1.25 Lakh @ 10% / 12.5%

  // 5. Other Sources
  savingsInterest?: number;
  fixedDepositInterest?: number;
  dividendIncome?: number;
  otherIncome?: number;
}

export interface DeductionDetails {
  section80C?: number; // Max ₹1,50,000
  section80D_Self?: number; // Max ₹25,000 (or ₹50,000 senior)
  section80D_Parents?: number; // Max ₹25,000 (or ₹50,000 senior)
  section80CCD_1B?: number; // NPS additional max ₹50,000
  section80CCD_2?: number; // Employer NPS (allowed in BOTH regimes)
  section80TTA?: number; // Savings interest max ₹10,000
  section80TTB?: number; // Senior citizen savings/FD interest max ₹50,000
  section80G?: number; // Donations
  otherDeductions?: number;
}

export interface TaxCredits {
  tdsSalary?: number;
  tdsOtherThanSalary?: number;
  tcsCredit?: number;
  advanceTaxPaid?: number;
  selfAssessmentTax?: number;
}

export interface ITRCalculationInput {
  financialYear: string; // e.g. "2024-25", "2025-26", "2026-27"
  assessmentYear: string; // e.g. "2025-26", "2026-27", "2027-28"
  isSeniorCitizen?: boolean;
  isSuperSeniorCitizen?: boolean;
  income: IncomeDetails;
  deductions: DeductionDetails;
  credits?: TaxCredits;
}

export interface RegimeComputation {
  regime: "OLD_REGIME" | "NEW_REGIME_115BAC";
  grossSalary: number;
  standardDeductionSalary: number;
  netSalary: number;
  netHouseProperty: number;
  netBusinessProfit: number;
  capitalGains: number;
  incomeOtherSources: number;
  grossTotalIncome: number;
  totalDeductionsChapterVIA: number;
  totalTaxableIncome: number;
  taxOnSlabs: number;
  taxOnSpecialRates: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  marginalRelief: number;
  healthEducationCess: number;
  totalTaxLiability: number;
  totalCredits: number;
  netTaxPayable: number;
  refundDue: number;
  isRecommended: boolean;
  savingsVsAlternative: number;
}

export interface ComparativeTaxResult {
  oldRegime: RegimeComputation;
  newRegime: RegimeComputation;
  recommendedRegime: "OLD_REGIME" | "NEW_REGIME_115BAC";
  annualTaxSavings: number;
}

/**
 * Computes comparative tax liability under Old Tax Regime vs New Tax Regime (Section 115BAC)
 */
export function computeIncomeTax(input: ITRCalculationInput): ComparativeTaxResult {
  const { income, deductions, isSeniorCitizen, isSuperSeniorCitizen, credits } = input;

  const totalCredits =
    (credits?.tdsSalary || 0) +
    (credits?.tdsOtherThanSalary || 0) +
    (credits?.tcsCredit || 0) +
    (credits?.advanceTaxPaid || 0) +
    (credits?.selfAssessmentTax || 0);

  // -------------------------------------------------------------
  // 1. COMPUTE FOR NEW TAX REGIME (Section 115BAC)
  // -------------------------------------------------------------
  const grossSalary = income.grossSalary || 0;
  // New Regime Standard Deduction: ₹75,000
  const standardDeductionNew = grossSalary > 0 ? Math.min(grossSalary, 75000) : 0;
  const netSalaryNew = Math.max(0, grossSalary - standardDeductionNew);

  // House Property in New Regime: Self-occupied loss not allowed to be set off
  const rentalInc = income.rentalIncome || 0;
  const municipalTax = income.municipalTaxes || 0;
  const nav = Math.max(0, rentalInc - municipalTax);
  const stdDed24a = nav * 0.3;
  const netHousePropNew = Math.max(0, nav - stdDed24a);

  // Business & Other Sources
  const netBusiness = income.netBusinessProfit || 0;
  const capitalGains = (income.stcgNormal || 0) + (income.stcg111A || 0) + (income.ltcgNormal || 0) + (income.ltcg112A || 0);

  const ifos =
    (income.savingsInterest || 0) +
    (income.fixedDepositInterest || 0) +
    (income.dividendIncome || 0) +
    (income.otherIncome || 0);

  const grossTotalIncomeNew = netSalaryNew + netHousePropNew + netBusiness + capitalGains + ifos;

  // Deductions in New Regime: Only Section 80CCD(2) employer NPS contribution allowed
  const allowedDeductionsNew = deductions.section80CCD_2 || 0;
  const taxableIncomeNew = Math.max(0, Math.round((grossTotalIncomeNew - allowedDeductionsNew) / 10) * 10);

  // Slabs for New Regime:
  // 0 - 3,00,000: Nil
  // 3,00,001 - 7,00,000: 5% (Max 20,000)
  // 7,00,001 - 10,00,000: 10% (Max 30,000)
  // 10,00,001 - 12,00,000: 15% (Max 30,000)
  // 12,00,001 - 15,00,000: 20% (Max 60,000)
  // Above 15,00,000: 30%
  let taxNew = 0;
  if (taxableIncomeNew > 1500000) {
    taxNew = 140000 + (taxableIncomeNew - 1500000) * 0.3;
  } else if (taxableIncomeNew > 1200000) {
    taxNew = 80000 + (taxableIncomeNew - 1200000) * 0.2;
  } else if (taxableIncomeNew > 1000000) {
    taxNew = 50000 + (taxableIncomeNew - 1000000) * 0.15;
  } else if (taxableIncomeNew > 700000) {
    taxNew = 20000 + (taxableIncomeNew - 700000) * 0.1;
  } else if (taxableIncomeNew > 300000) {
    taxNew = (taxableIncomeNew - 300000) * 0.05;
  }

  // Section 87A Rebate for New Regime:
  // Full rebate if taxable income <= ₹7,00,000 (tax becomes 0)
  let rebate87ANew = 0;
  if (taxableIncomeNew <= 700000) {
    rebate87ANew = taxNew;
  } else {
    // Marginal relief if income slightly above 7,00,000
    const excessIncome = taxableIncomeNew - 700000;
    if (taxNew > excessIncome) {
      rebate87ANew = taxNew - excessIncome;
    }
  }

  const taxAfterRebateNew = Math.max(0, taxNew - rebate87ANew);

  // Surcharge (New regime capped at 25%)
  let surchargeNew = 0;
  if (taxableIncomeNew > 20000000) {
    surchargeNew = taxAfterRebateNew * 0.25;
  } else if (taxableIncomeNew > 10000000) {
    surchargeNew = taxAfterRebateNew * 0.15;
  } else if (taxableIncomeNew > 5000000) {
    surchargeNew = taxAfterRebateNew * 0.1;
  }

  const cessNew = Math.round((taxAfterRebateNew + surchargeNew) * 0.04);
  const totalTaxLiabilityNew = taxAfterRebateNew + surchargeNew + cessNew;
  const netTaxPayableNew = Math.max(0, totalTaxLiabilityNew - totalCredits);
  const refundDueNew = Math.max(0, totalCredits - totalTaxLiabilityNew);

  // -------------------------------------------------------------
  // 2. COMPUTE FOR OLD TAX REGIME
  // -------------------------------------------------------------
  const salaryExemptions = income.salaryExemptions || 0;
  const standardDeductionOld = grossSalary > 0 ? Math.min(grossSalary - salaryExemptions, 50000) : 0;
  const netSalaryOld = Math.max(0, grossSalary - salaryExemptions - standardDeductionOld);

  // House Property in Old Regime: allows deduction for self-occupied home loan interest up to ₹2,00,000
  const homeLoanInt = Math.min(income.homeLoanInterestSelfOccupied || 0, 200000);
  const netHousePropOld = nav - stdDed24a - homeLoanInt;

  const grossTotalIncomeOld = netSalaryOld + netHousePropOld + netBusiness + capitalGains + ifos;

  // Chapter VI-A Deductions in Old Regime:
  const ded80C = Math.min(deductions.section80C || 0, 150000);
  const ded80D_Self = Math.min(deductions.section80D_Self || 0, isSeniorCitizen ? 50000 : 25000);
  const ded80D_Parents = Math.min(deductions.section80D_Parents || 0, 50000);
  const ded80CCD_1B = Math.min(deductions.section80CCD_1B || 0, 50000);
  const ded80CCD_2 = deductions.section80CCD_2 || 0;
  const dedTTA_TTB = isSeniorCitizen
    ? Math.min(deductions.section80TTB || 0, 50000)
    : Math.min(deductions.section80TTA || 0, 10000);
  const ded80G = deductions.section80G || 0;

  const totalDeductionsOld = Math.min(
    grossTotalIncomeOld,
    ded80C + ded80D_Self + ded80D_Parents + ded80CCD_1B + ded80CCD_2 + dedTTA_TTB + ded80G + (deductions.otherDeductions || 0)
  );

  const taxableIncomeOld = Math.max(0, Math.round((grossTotalIncomeOld - totalDeductionsOld) / 10) * 10);

  // Slabs for Old Regime:
  const exemptionLimitOld = isSuperSeniorCitizen ? 500000 : isSeniorCitizen ? 300000 : 250000;
  let taxOld = 0;

  if (taxableIncomeOld > 1000000) {
    const baseAt10L = exemptionLimitOld === 500000 ? 100000 : exemptionLimitOld === 300000 ? 110000 : 112500;
    taxOld = baseAt10L + (taxableIncomeOld - 1000000) * 0.3;
  } else if (taxableIncomeOld > 500000) {
    const baseAt5L = exemptionLimitOld === 500000 ? 0 : exemptionLimitOld === 300000 ? 10000 : 12500;
    taxOld = baseAt5L + (taxableIncomeOld - 500000) * 0.2;
  } else if (taxableIncomeOld > exemptionLimitOld) {
    taxOld = (taxableIncomeOld - exemptionLimitOld) * 0.05;
  }

  // Section 87A Rebate for Old Regime (Income <= ₹5,00,000, max ₹12,500)
  let rebate87AOld = 0;
  if (taxableIncomeOld <= 500000) {
    rebate87AOld = Math.min(taxOld, 12500);
  }

  const taxAfterRebateOld = Math.max(0, taxOld - rebate87AOld);

  let surchargeOld = 0;
  if (taxableIncomeOld > 50000000) {
    surchargeOld = taxAfterRebateOld * 0.37;
  } else if (taxableIncomeOld > 20000000) {
    surchargeOld = taxAfterRebateOld * 0.25;
  } else if (taxableIncomeOld > 10000000) {
    surchargeOld = taxAfterRebateOld * 0.15;
  } else if (taxableIncomeOld > 5000000) {
    surchargeOld = taxAfterRebateOld * 0.1;
  }

  const cessOld = Math.round((taxAfterRebateOld + surchargeOld) * 0.04);
  const totalTaxLiabilityOld = taxAfterRebateOld + surchargeOld + cessOld;
  const netTaxPayableOld = Math.max(0, totalTaxLiabilityOld - totalCredits);
  const refundDueOld = Math.max(0, totalCredits - totalTaxLiabilityOld);

  // -------------------------------------------------------------
  // 3. COMPARISON & RECOMMENDATION
  // -------------------------------------------------------------
  const isNewBetter = totalTaxLiabilityNew <= totalTaxLiabilityOld;
  const recommendedRegime = isNewBetter ? "NEW_REGIME_115BAC" : "OLD_REGIME";
  const diff = Math.abs(totalTaxLiabilityOld - totalTaxLiabilityNew);

  return {
    oldRegime: {
      regime: "OLD_REGIME",
      grossSalary,
      standardDeductionSalary: standardDeductionOld,
      netSalary: netSalaryOld,
      netHouseProperty: netHousePropOld,
      netBusinessProfit: netBusiness,
      capitalGains,
      incomeOtherSources: ifos,
      grossTotalIncome: grossTotalIncomeOld,
      totalDeductionsChapterVIA: totalDeductionsOld,
      totalTaxableIncome: taxableIncomeOld,
      taxOnSlabs: taxOld,
      taxOnSpecialRates: 0,
      rebate87A: rebate87AOld,
      taxAfterRebate: taxAfterRebateOld,
      surcharge: surchargeOld,
      marginalRelief: 0,
      healthEducationCess: cessOld,
      totalTaxLiability: totalTaxLiabilityOld,
      totalCredits,
      netTaxPayable: netTaxPayableOld,
      refundDue: refundDueOld,
      isRecommended: !isNewBetter,
      savingsVsAlternative: !isNewBetter ? diff : 0,
    },
    newRegime: {
      regime: "NEW_REGIME_115BAC",
      grossSalary,
      standardDeductionSalary: standardDeductionNew,
      netSalary: netSalaryNew,
      netHouseProperty: netHousePropNew,
      netBusinessProfit: netBusiness,
      capitalGains,
      incomeOtherSources: ifos,
      grossTotalIncome: grossTotalIncomeNew,
      totalDeductionsChapterVIA: allowedDeductionsNew,
      totalTaxableIncome: taxableIncomeNew,
      taxOnSlabs: taxNew,
      taxOnSpecialRates: 0,
      rebate87A: rebate87ANew,
      taxAfterRebate: taxAfterRebateNew,
      surcharge: surchargeNew,
      marginalRelief: 0,
      healthEducationCess: cessNew,
      totalTaxLiability: totalTaxLiabilityNew,
      totalCredits,
      netTaxPayable: netTaxPayableNew,
      refundDue: refundDueNew,
      isRecommended: isNewBetter,
      savingsVsAlternative: isNewBetter ? diff : 0,
    },
    recommendedRegime,
    annualTaxSavings: diff,
  };
}
