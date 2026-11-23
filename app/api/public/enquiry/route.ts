import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, serviceName, message } = body;

    if (!name || !email || !mobile || !serviceName || !message) {
      return NextResponse.json(
        { error: "All fields are required to submit an enquiry." },
        { status: 400 }
      );
    }

    const enquiry = await db.enquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        mobile: String(mobile).trim(),
        serviceName: String(serviceName).trim(),
        message: String(message).trim(),
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been received. Our partner will review your requirements and reach out within 24 hours.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json({ error: "Failed to record enquiry. Please try again." }, { status: 500 });
  }
}
