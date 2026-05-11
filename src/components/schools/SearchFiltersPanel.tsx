"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  KENYA_COUNTIES, SCHOOL_TYPE_LABELS, LEVEL_LABELS, CONDITION_LABELS
} from "@/types";
import type { ConditionSupported, SchoolLevel, SchoolType, SearchFilters } from "@/types";
import { cn } from "@/lib/utils/helpers";

interface Props {
  initialFilters: SearchFilters & { page?: number };
}

export default function SearchFiltersPanel({ initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams();
      // Reset page on any filter change
      const current: Record<string, string | string[]> = {
        ...(initialFilters.query && { q: initialFilters.query }),
        ...(initialFilters.county && { county: initialFilters.county }),
        ...(initialFilters.school_type && { type: initialFilters.school_type }),
        ...(initialFilters.levels?.length && { levels: initialFilters.levels }),
        ...(initialFilters.conditions?.length && { conditions: initialFilters.conditions }),
      };

      // Apply the new change
      if (value) {
        current[key] = value;
      } else {
        delete current[key];
      }

      Object.entries(current).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => params.append(k, item));
        } else {
          params.set(k, v);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [initialFilters, pathname, router]
  );

  const toggleArrayFilter = useCallback(
    (key: string, value: string, current: string[] | undefined) => {
      const arr = current ?? [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];

      const params = new URLSearchParams();
      if (initialFilters.query) params.set("q", initialFilters.query);
      if (initialFilters.county) params.set("county", initialFilters.county);
      if (initialFilters.school_type) params.set("type", initialFilters.school_type);

      // Update the toggled key
      const levelValues = key === "levels" ? next : (initialFilters.levels ?? []);
      const conditionValues = key === "conditions" ? next : (initialFilters.conditions ?? []);
      levelValues.forEach((v) => params.append("levels", v));
      conditionValues.forEach((v) => params.append("conditions", v));

      router.push(`${pathname}?${params.toString()}`);
    },
    [initialFilters, pathname, router]
  );

  return (
    <div className="space-y-6 text-sm sticky top-6">
      {/* County */}
      <FilterSection title="County">
        <select
          value={initialFilters.county ?? ""}
          onChange={(e) => updateFilter("county", e.target.value || undefined)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="">All counties</option>
          {KENYA_COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FilterSection>

      {/* School type */}
      <FilterSection title="School type">
        <div className="space-y-1.5">
          {(Object.entries(SCHOOL_TYPE_LABELS) as [SchoolType, string][]).map(([type, label]) => (
            <button
              key={type}
              onClick={() =>
                updateFilter("type", initialFilters.school_type === type ? undefined : type)
              }
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                initialFilters.school_type === type
                  ? "bg-brand-500 text-white font-semibold"
                  : "hover:bg-stone-100 text-stone-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Levels */}
      <FilterSection title="Level">
        <div className="space-y-1.5">
          {(Object.entries(LEVEL_LABELS) as [SchoolLevel, string][]).map(([level, label]) => {
            const active = initialFilters.levels?.includes(level);
            return (
              <button
                key={level}
                onClick={() => toggleArrayFilter("levels", level, initialFilters.levels)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-brand-500 text-white font-semibold"
                    : "hover:bg-stone-100 text-stone-700"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Conditions */}
      <FilterSection title="Conditions supported">
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {(Object.entries(CONDITION_LABELS) as [ConditionSupported, string][]).map(([cond, label]) => {
            const active = initialFilters.conditions?.includes(cond);
            return (
              <button
                key={cond}
                onClick={() => toggleArrayFilter("conditions", cond, initialFilters.conditions)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-brand-500 text-white font-semibold"
                    : "hover:bg-stone-100 text-stone-700"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Clear all */}
      {(initialFilters.county || initialFilters.school_type ||
        initialFilters.levels?.length || initialFilters.conditions?.length) && (
        <button
          onClick={() => router.push(pathname)}
          className="w-full text-center text-xs text-stone-400 hover:text-stone-700 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-display font-semibold text-stone-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}
