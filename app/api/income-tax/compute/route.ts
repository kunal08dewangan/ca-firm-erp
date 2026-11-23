import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { computeIncomeTax, ITRCalculationInput } from "@/lib/itr-engine";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: ITRCalculationInput = await req.json();

    const result = computeIncomeTax(body);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Tax calculation failed" }, { status: 500 });
  }
}
