import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { formatDistanceToNow } from "date-fns";
import {
  CONDITION_LABELS,
  KENYA_COUNTIES,
  LEVEL_LABELS,
  SCHOOL_TYPE_LABELS,
  type ConditionSupported,
  type KenyanCounty,
  type SchoolLevel,
  type SchoolType,
  type SearchFilters,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeSlug(name: string, county: string): string {
  return slugify(`${name} ${county}`, { lower: true, strict: true });
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isStale(lastVerifiedAt?: string, months = 6): boolean {
  if (!lastVerifiedAt) return true;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return new Date(lastVerifiedAt) < cutoff;
}

export function formatPhone(phone: string): string {
  // Normalise to +254 format for display
  if (phone.startsWith("0")) return "+254" + phone.slice(1);
  return phone;
}

export function buildWhatsAppShareUrl(schoolName: string, url: string): string {
  const text = encodeURIComponent(
    `Check out ${schoolName} on Elimu Finder — a directory of schools for neurodivergent learners in Kenya: ${url}`
  );
  return `https://wa.me/?text=${text}`;
}

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): SearchFilters & { page: number } {
  const levelValues = Object.keys(LEVEL_LABELS) as SchoolLevel[];
  const conditionValues = Object.keys(CONDITION_LABELS) as ConditionSupported[];
  const schoolTypeValues = Object.keys(SCHOOL_TYPE_LABELS) as SchoolType[];

  const county =
    typeof params.county === "string" && KENYA_COUNTIES.includes(params.county as KenyanCounty)
      ? params.county as KenyanCounty
      : undefined;
  const schoolType =
    typeof params.type === "string" && schoolTypeValues.includes(params.type as SchoolType)
      ? params.type as SchoolType
      : undefined;
  const rawLevels = Array.isArray(params.levels)
    ? params.levels
    : typeof params.levels === "string"
    ? [params.levels]
    : [];
  const rawConditions = Array.isArray(params.conditions)
    ? params.conditions
    : typeof params.conditions === "string"
    ? [params.conditions]
    : [];
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;

  return {
    query: typeof params.q === "string" ? params.q : undefined,
    county,
    school_type: schoolType,
    levels: rawLevels.filter((level): level is SchoolLevel =>
      levelValues.includes(level as SchoolLevel)
    ),
    conditions: rawConditions.filter((condition): condition is ConditionSupported =>
      conditionValues.includes(condition as ConditionSupported)
    ),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}
