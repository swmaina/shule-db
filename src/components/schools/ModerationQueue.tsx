"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, ExternalLink, MapPin } from "lucide-react";
import type { School } from "@/types";
import { SCHOOL_TYPE_LABELS, LEVEL_LABELS, CONDITION_LABELS } from "@/types";
import { timeAgo } from "@/lib/utils/helpers";

export default function ModerationQueue({ schools: initial }: { schools: School[] }) {
  const [schools, setSchools] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  async function moderate(schoolId: string, action: "approve" | "reject") {
    setLoading(schoolId);
    try {
      const res = await fetch("/api/schools/moderate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, action }),
      });
      if (!res.ok) throw new Error("Failed");
      setSchools((prev) => prev.filter((s) => s.id !== schoolId));
      toast.success(`School ${action === "approve" ? "approved ✅" : "rejected"}`);
    } catch {
      toast.error("Action failed — try again");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {schools.map((school) => (
        <div
          key={school.id}
          className="bg-white rounded-xl border border-stone-200 p-5"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                  {SCHOOL_TYPE_LABELS[school.school_type]}
                </span>
                <span className="text-xs text-stone-400">{timeAgo(school.created_at)}</span>
              </div>
              <h3 className="font-display font-bold text-base">{school.name}</h3>
              <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {[school.estate, school.town, school.county].filter(Boolean).join(", ")}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {school.levels.map((l) => (
                  <span key={l} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {LEVEL_LABELS[l]}
                  </span>
                ))}
                {school.conditions_supported.slice(0, 5).map((c) => (
                  <span key={c} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                    {CONDITION_LABELS[c]}
                  </span>
                ))}
              </div>

              {school.description && (
                <p className="text-sm text-stone-500 mt-2 line-clamp-2">{school.description}</p>
              )}

              <div className="flex gap-3 mt-2 text-xs text-stone-500">
                {school.phone && <span>📞 {school.phone}</span>}
                {school.email && <span>✉️ {school.email}</span>}
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-brand-600 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Website
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => moderate(school.id, "reject")}
                disabled={loading === school.id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => moderate(school.id, "approve")}
                disabled={loading === school.id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
