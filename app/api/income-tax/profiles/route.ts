import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";
import { computeIncomeTax } from "@/lib/itr-engine";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const ay = searchParams.get("ay");

    const where: any = {};
    if (ay && ay !== "ALL") {
      where.assessmentYear = ay;
    }

    const profiles = await db.itrProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        computations: true,
        filings: true,
      },
    });

    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ITR profiles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      clientId,
      financialYear,
      assessmentYear,
      itrForm,
      chosenRegime,
      residentialStatus,
      isSeniorCitizen,
      income,
      deductions,
      credits,
    } = body;

    if (!clientId || !financialYear || !assessmentYear) {
      return NextResponse.json({ error: "Client, Financial Year, and Assessment Year are required." }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.itrProfile.findFirst({
      where: {
        clientId,
        financialYear,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `ITR Profile for FY ${financialYear} already exists for this client.` },
        { status: 409 }
      );
    }

    // Compute Tax under both regimes
    const calc = computeIncomeTax({
      financialYear,
      assessmentYear,
      isSeniorCitizen: Boolean(isSeniorCitizen),
      income: income || {},
      deductions: deductions || {},
      credits: credits || {},
    });

    // Save profile and computations in database
    const profile = await db.itrProfile.create({
      data: {
        clientId,
        financialYear,
        assessmentYear,
        itrForm: itrForm || "ITR_1_SAHAJ",
        chosenRegime: chosenRegime || calc.recommendedRegime,
        residentialStatus: residentialStatus || "RESIDENT",
        isSeniorCitizen: Boolean(isSeniorCitizen),
        computations: {
          create: [
            {
              regime: calc.newRegime.regime,
              grossTotalIncome: calc.newRegime.grossTotalIncome,
              totalDeductions: calc.newRegime.totalDeductionsChapterVIA,
              totalTaxableIncome: calc.newRegime.totalTaxableIncome,
              taxOnNormalIncome: calc.newRegime.taxOnSlabs,
              rebate87A: calc.newRegime.rebate87A,
              taxAfterRebate: calc.newRegime.taxAfterRebate,
              surcharge: calc.newRegime.surcharge,
              marginalRelief: calc.newRegime.marginalRelief,
              healthEducationCess: calc.newRegime.healthEducationCess,
              totalTaxLiability: calc.newRegime.totalTaxLiability,
              tdsCredit: credits?.tdsSalary || 0,
              advanceTaxPaid: credits?.advanceTaxPaid || 0,
              netTaxPayable: calc.newRegime.netTaxPayable,
              refundDue: calc.newRegime.refundDue,
              isRecommendedRegime: calc.newRegime.isRecommended,
            },
            {
              regime: calc.oldRegime.regime,
              grossTotalIncome: calc.oldRegime.grossTotalIncome,
              totalDeductions: calc.oldRegime.totalDeductionsChapterVIA,
              totalTaxableIncome: calc.oldRegime.totalTaxableIncome,
              taxOnNormalIncome: calc.oldRegime.taxOnSlabs,
              rebate87A: calc.oldRegime.rebate87A,
              taxAfterRebate: calc.oldRegime.taxAfterRebate,
              surcharge: calc.oldRegime.surcharge,
              marginalRelief: calc.oldRegime.marginalRelief,
              healthEducationCess: calc.oldRegime.healthEducationCess,
              totalTaxLiability: calc.oldRegime.totalTaxLiability,
              tdsCredit: credits?.tdsSalary || 0,
              advanceTaxPaid: credits?.advanceTaxPaid || 0,
              netTaxPayable: calc.oldRegime.netTaxPayable,
              refundDue: calc.oldRegime.refundDue,
              isRecommendedRegime: calc.oldRegime.isRecommended,
            },
          ],
        },
      },
      include: {
        computations: true,
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "ITR_PROFILE_CREATED",
      module: "INCOME_TAX",
      recordId: profile.id,
      diff: { clientId, financialYear, assessmentYear, recommended: calc.recommendedRegime },
    });

    return NextResponse.json({ success: true, profile, calculation: calc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create ITR profile" }, { status: 500 });
  }
}
