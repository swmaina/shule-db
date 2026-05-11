import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ModerationQueue from "@/components/schools/ModerationQueue";
import type { School } from "@/types";

async function getSchoolsByStatus(status: string): Promise<School[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as School[]) ?? [];
}

interface PageProps {
  searchParams: { status?: string };
}

export default async function ModeratePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  const status = searchParams.status ?? "pending";
  const schools = await getSchoolsByStatus(status);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-xl mb-6">Moderation queue</h1>

        {/* Status tabs */}
        <div className="flex gap-2 mb-6">
          {["pending", "approved", "rejected"].map((s) => (
            <a
              key={s}
              href={`/admin/moderate?status=${s}`}
              className={`px-4 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-colors ${
                status === s
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
              }`}
            >
              {s}
            </a>
          ))}
        </div>

        {schools.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
            <p className="text-3xl mb-3">✅</p>
            <p className="font-display font-semibold">No {status} schools</p>
          </div>
        ) : (
          <ModerationQueue schools={schools} />
        )}
      </div>
    </div>
  );
}
