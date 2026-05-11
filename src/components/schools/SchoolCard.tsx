import Link from "next/link";
import { MapPin, CheckCircle, AlertTriangle, GraduationCap } from "lucide-react";
import type { School } from "@/types";
import {
  SCHOOL_TYPE_LABELS, LEVEL_LABELS, CONDITION_LABELS
} from "@/types";
import { isStale, timeAgo } from "@/lib/utils/helpers";
import { cn } from "@/lib/utils/helpers";

const TYPE_COLORS = {
  special:    "bg-purple-50 text-purple-700 border-purple-200",
  integrated: "bg-blue-50 text-blue-700 border-blue-200",
  inclusive:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface Props {
  school: School;
}

export default function SchoolCard({ school }: Props) {
  const stale = isStale(school.last_verified_at);

  return (
    <Link
      href={`/schools/${school.slug}`}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-brand-300 hover:shadow-md transition-all p-5 block"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-50 transition-colors">
          <GraduationCap className="w-5 h-5 text-stone-400 group-hover:text-brand-500 transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-semibold text-base group-hover:text-brand-600 transition-colors">
                {school.name}
              </h2>
              {school.is_verified && (
                <CheckCircle className="w-4 h-4 text-forest-500 shrink-0" />
              )}
            </div>
            <span
              className={cn(
                "text-xs font-display font-semibold px-2.5 py-1 rounded-full border",
                TYPE_COLORS[school.school_type]
              )}
            >
              {SCHOOL_TYPE_LABELS[school.school_type]}
            </span>
          </div>

          {/* Location */}
          <p className="flex items-center gap-1 text-sm text-stone-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {[school.estate, school.town, school.county].filter(Boolean).join(", ")}
          </p>

          {/* Levels */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {school.levels.map((l) => (
              <span key={l} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                {LEVEL_LABELS[l]}
              </span>
            ))}
          </div>

          {/* Top conditions */}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {school.conditions_supported.slice(0, 4).map((c) => (
              <span key={c} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                {CONDITION_LABELS[c]}
              </span>
            ))}
            {school.conditions_supported.length > 4 && (
              <span className="text-xs text-stone-400">
                +{school.conditions_supported.length - 4} more
              </span>
            )}
          </div>

          {/* Stale warning */}
          {stale && (
            <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
              <AlertTriangle className="w-3 h-3" />
              May be outdated — last verified {school.last_verified_at ? timeAgo(school.last_verified_at) : "unknown"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
