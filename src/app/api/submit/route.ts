import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { submitSchoolSchema } from "@/lib/validations/school";
import { makeSlug } from "@/lib/utils/helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submitSchoolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      submitter_name,
      submitter_email,
      submitter_role,
      ...schoolData
    } = parsed.data;

    const supabase = createAdminClient();

    // Generate a unique slug
    let slug = makeSlug(schoolData.name, schoolData.county);
    const { data: existing } = await supabase
      .from("schools")
      .select("slug")
      .eq("slug", slug);

    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const { data: school, error } = await supabase
      .from("schools")
      .insert({
        ...schoolData,
        slug,
        status: "pending",
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id, name, slug")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: "Failed to save school" }, { status: 500 });
    }

    // Log the submission for follow-up
    await supabase.from("submissions_log").insert({
      school_id: school.id,
      submitter_name,
      submitter_email,
      submitter_role,
      created_at: new Date().toISOString(),
    });

    // TODO: Send confirmation email via Resend
    // await sendSubmissionConfirmation({ submitter_email, submitter_name, schoolName: school.name });

    return NextResponse.json({ success: true, school }, { status: 201 });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
