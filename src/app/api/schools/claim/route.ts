import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { schoolId, email, fullName, role } = await req.json();

    if (!schoolId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Log the claim intent — admin reviews and verifies
    const { error } = await supabase.from("claim_requests").insert({
      school_id: schoolId,
      email,
      full_name: fullName,
      role_at_school: role,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Claim insert error:", error);
      return NextResponse.json({ error: "Failed to log claim" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
