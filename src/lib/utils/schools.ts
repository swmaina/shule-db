import { createClient } from "@/lib/supabase/server";
import type { School, SearchFilters, SearchResult } from "@/types";

const PER_PAGE = 20;

export async function searchSchools(
  filters: SearchFilters,
  page = 1
): Promise<SearchResult> {
  const supabase = await createClient();
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  let query = supabase
    .from("schools")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .range(from, to)
    .order("is_verified", { ascending: false })
    .order("name", { ascending: true });

  if (filters.query) {
    query = query.textSearch("search_vector", filters.query, {
      type: "websearch",
    });
  }
  if (filters.county) {
    query = query.eq("county", filters.county);
  }
  if (filters.school_type) {
    query = query.eq("school_type", filters.school_type);
  }
  if (filters.levels?.length) {
    query = query.overlaps("levels", filters.levels);
  }
  if (filters.conditions?.length) {
    query = query.overlaps("conditions_supported", filters.conditions);
  }
  if (filters.is_boarding !== undefined) {
    query = query.eq("is_boarding", filters.is_boarding);
  }
  if (filters.fee_range) {
    query = query.eq("fee_range", filters.fee_range);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    schools: (data as School[]) ?? [],
    total: count ?? 0,
    page,
    per_page: PER_PAGE,
  };
}

export async function getSchoolBySlug(slug: string): Promise<School | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error) return null;
  return data as School;
}

export async function getSchoolsForMap(
  county?: string
): Promise<Pick<School, "id" | "slug" | "name" | "lat" | "lng" | "school_type" | "county">[]> {
  const supabase = await createClient();
  let query = supabase
    .from("schools")
    .select("id, slug, name, lat, lng, school_type, county")
    .eq("status", "approved")
    .not("lat", "is", null);

  if (county) query = query.eq("county", county);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPendingSchools(): Promise<School[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as School[]) ?? [];
}

export async function approveSchool(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("schools")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function rejectSchool(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("schools")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
