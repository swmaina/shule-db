import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { formatDistanceToNow } from "date-fns";

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
) {
  return {
    query: typeof params.q === "string" ? params.q : undefined,
    county: typeof params.county === "string" ? params.county : undefined,
    school_type:
      typeof params.type === "string" ? params.type : undefined,
    levels: Array.isArray(params.levels)
      ? params.levels
      : params.levels
      ? [params.levels]
      : undefined,
    conditions: Array.isArray(params.conditions)
      ? params.conditions
      : params.conditions
      ? [params.conditions]
      : undefined,
    page: typeof params.page === "string" ? parseInt(params.page, 10) : 1,
  };
}
