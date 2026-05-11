// supabase/functions/send-verification-reminders/index.ts
// Deploy with: supabase functions deploy send-verification-reminders
// Schedule via: Supabase Dashboard → Edge Functions → Schedules (cron: "0 9 * * 1")
// This runs every Monday at 9am UTC — sends reminders to schools unverified >6 months.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("NEXT_PUBLIC_APP_URL") ?? "https://elimufinder.co.ke";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async () => {
  // Get schools needing verification that have a school admin email
  const { data: schools, error } = await supabase
    .from("schools_needing_verification")
    .select("*")
    .not("admin_email", "is", null)
    .limit(50); // process in batches

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const school of schools ?? []) {
    // Check if we've sent a reminder in the last 30 days
    const { data: recent } = await supabase
      .from("verification_reminders")
      .select("id")
      .eq("school_id", school.id)
      .gte("sent_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) continue; // already reminded recently

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Elimu Finder <noreply@elimufinder.co.ke>",
        to: school.admin_email,
        subject: `Please verify ${school.name} on Elimu Finder`,
        html: `
          <p>Hello,</p>
          <p>You're listed as the administrator for <strong>${school.name}</strong> on Elimu Finder.</p>
          <p>It's been more than 6 months since this listing was verified. Families rely on this information being accurate, so we'd love you to take 2 minutes to confirm the details are still current.</p>
          <p><a href="${APP_URL}/schools/${school.slug}" style="background:#ff7a10;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Review our listing →</a></p>
          <p>If anything has changed, please log in and update your profile, or reply to this email and we'll update it for you.</p>
          <p>Thank you for helping families find the right school.<br>The Elimu Finder team</p>
        `,
      }),
    });

    if (res.ok) {
      await supabase.from("verification_reminders").insert({
        school_id: school.id,
        sent_to: school.admin_email,
      });
      sent++;
    } else {
      errors.push(`Failed for school ${school.id}`);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors, total: schools?.length ?? 0 }),
    { headers: { "Content-Type": "application/json" } }
  );
});
