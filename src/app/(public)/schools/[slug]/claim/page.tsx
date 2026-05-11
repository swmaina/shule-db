"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CheckCircle, ShieldCheck } from "lucide-react";

export default function ClaimSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const supabase = createClient();

  const [school, setSchool] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase
      .from("schools")
      .select("id, name")
      .eq("slug", slug)
      .eq("status", "approved")
      .single()
      .then(({ data }) => {
        setSchool(data);
        setLoading(false);
      });
  }, [slug]);

  async function handleClaim() {
    if (!school) return;
    setSubmitting(true);

    // Sign up / sign in with email OTP
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { full_name: fullName, role: "school_admin" },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/schools/${slug}/claim/verify`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      // Log the claim intent
      await fetch("/api/schools/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: school.id, email, fullName, role }),
      });
      setSent(true);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-4xl mb-3">🏫</p>
          <p className="font-display font-semibold">School not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-2">Claim this listing</h1>
        <p className="text-stone-500 text-sm">
          Verify that you represent <span className="font-semibold text-stone-700">{school.name}</span> to
          manage your school's profile on Elimu Finder.
        </p>
      </div>

      {sent ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
          <p className="font-display font-semibold text-emerald-800 mb-1">Check your email</p>
          <p className="text-emerald-700 text-sm">
            We've sent a verification link to <strong>{email}</strong>.
            Click it to complete your claim — the link expires in 1 hour.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-display font-semibold text-stone-600 mb-1.5">
              Your full name *
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="Jane Mwangi"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-stone-600 mb-1.5">
              Work email address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="jane@schoolname.ac.ke"
            />
            <p className="text-xs text-stone-400 mt-1">
              Use your school email address for faster verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-stone-600 mb-1.5">
              Your role at the school *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300"
            >
              <option value="">Select role</option>
              <option value="principal">Principal / Head teacher</option>
              <option value="administrator">School administrator</option>
              <option value="marketing">Marketing / Communications</option>
              <option value="owner">School owner / Director</option>
              <option value="other">Other staff</option>
            </select>
          </div>

          <button
            onClick={handleClaim}
            disabled={submitting || !email || !fullName || !role}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-display font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {submitting ? "Sending…" : "Send verification link"}
          </button>

          <p className="text-xs text-stone-400 text-center">
            We'll review your claim within 24–48 hours. False claims are removed.
          </p>
        </div>
      )}
    </div>
  );
}
