import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPendingSchools } from "@/lib/utils/schools";
import ModerationQueue from "@/components/schools/ModerationQueue";

async function getAdminStats() {
  const supabase = await createClient();
  const [approved, pending, rejected] = await Promise.all([
    supabase.from("schools").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("schools").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("schools").select("*", { count: "exact", head: true }).eq("status", "rejected"),
  ]);
  return {
    approved: approved.count ?? 0,
    pending: pending.count ?? 0,
    rejected: rejected.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const [stats, pendingSchools] = await Promise.all([
    getAdminStats(),
    getPendingSchools(),
  ]);

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg">Elimu Finder — Admin</h1>
            <p className="text-stone-500 text-sm">{user.email}</p>
          </div>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
            ← View site
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Live schools", value: stats.approved, color: "text-forest-600" },
            { label: "Pending review", value: stats.pending, color: "text-amber-600" },
            { label: "Rejected", value: stats.rejected, color: "text-red-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-200 p-5 text-center">
              <p className={`font-display font-bold text-3xl ${color}`}>{value}</p>
              <p className="text-stone-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Moderation queue */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            Pending submissions ({pendingSchools.length})
          </h2>
          {pendingSchools.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center text-stone-400">
              <p className="text-2xl mb-2">✅</p>
              <p>No pending submissions — queue is clear!</p>
            </div>
          ) : (
            <ModerationQueue schools={pendingSchools} />
          )}
        </div>
      </div>
    </main>
  );
}
