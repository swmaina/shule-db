import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  // Verify the requesting user is an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { schoolId, action } = body as { schoolId: string; action: "approve" | "reject" };

  if (!schoolId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const newStatus = action === "approve" ? "approved" : "rejected";

  const { error } = await adminClient
    .from("schools")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...(action === "approve" ? { last_verified_at: new Date().toISOString() } : {}),
    })
    .eq("id", schoolId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: newStatus });
}
