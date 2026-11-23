import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, preferredDate, preferredTimeSlot, serviceRequired, notes } = body;

    if (!name || !email || !mobile || !preferredDate || !preferredTimeSlot || !serviceRequired) {
      return NextResponse.json(
        { error: "Please fill in all mandatory appointment fields." },
        { status: 400 }
      );
    }

    const appointment = await db.appointment.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        mobile: String(mobile).trim(),
        preferredDate: new Date(preferredDate),
        preferredTimeSlot: String(preferredTimeSlot).trim(),
        serviceRequired: String(serviceRequired).trim(),
        notes: notes ? String(notes).trim() : null,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully! A calendar invitation has been sent to your email.",
      appointmentId: appointment.id,
    });
  } catch (error) {
    console.error("Appointment API error:", error);
    return NextResponse.json({ error: "Failed to book consultation." }, { status: 500 });
  }
}
