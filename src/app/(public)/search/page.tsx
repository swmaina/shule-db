import type { Metadata } from "next";
import { searchSchools, getSchoolsForMap } from "@/lib/utils/schools";
import { parseSearchParams } from "@/lib/utils/helpers";
import SchoolCard from "@/components/schools/SchoolCard";
import SearchFiltersPanel from "@/components/schools/SearchFiltersPanel";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import SearchBar from "@/components/schools/SearchBar";
import dynamic from "next/dynamic";

const SchoolMapOverview = dynamic(
  () => import("@/components/map/SchoolMapOverview"),
  { ssr: false, loading: () => <div className="h-96 bg-stone-100 rounded-2xl animate-pulse" /> }
);

export const metadata: Metadata = {
  title: "Search Schools",
  description: "Find special, integrated, and inclusive schools for neurodivergent learners across Kenya.",
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const filters = parseSearchParams(searchParams);
  const view = typeof searchParams.view === "string" ? searchParams.view : "list";

  const [{ schools, total, page, per_page }, mapPins] = await Promise.all([
    searchSchools(filters, filters.page),
    view === "map" ? getSchoolsForMap(filters.county) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / per_page);

  const baseParams = new URLSearchParams();
  if (filters.query) baseParams.set("q", filters.query);
  if (filters.county) baseParams.set("county", filters.county);
  if (filters.school_type) baseParams.set("type", filters.school_type);
  filters.levels?.forEach((l) => baseParams.append("levels", l));
  filters.conditions?.forEach((c) => baseParams.append("conditions", c));

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <SearchBar initialQuery={filters.query} />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-stone-500 text-sm">
              {total === 0
                ? "No schools found — try adjusting your filters"
                : `${total} school${total !== 1 ? "s" : ""} found`}
            </p>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              {["list", "map"].map((v) => (
                <a key={v} href={`/search?${baseParams.toString()}&view=${v}`}
                  className={`px-3 py-1.5 rounded-md text-xs font-display font-semibold capitalize transition-colors ${
                    (view === "map" ? v === "map" : v === "list")
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}>
                  {v}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <SearchFiltersPanel initialFilters={filters} />
        </aside>

        <section className="flex-1 min-w-0 space-y-6">
          {view === "map" ? (
            <>
              <SchoolMapOverview
                pins={mapPins.filter((s) => s.lat && s.lng).map((s) => ({
                  id: s.id, slug: s.slug, name: s.name,
                  lat: s.lat!, lng: s.lng!, school_type: s.school_type,
                }))}
              />
              {mapPins.length === 0 && (
                <EmptyState emoji="🗺️" title="No mapped schools in this area"
                  description="Schools appear on the map once we have their coordinates."
                  action={{ label: "Switch to list", href: `/search?${baseParams.toString()}&view=list` }}
                />
              )}
            </>
          ) : schools.length === 0 ? (
            <EmptyState emoji="🔍" title="No schools match your search"
              description="Try broadening your filters, or add a school you know."
              action={{ label: "Add a school", href: "/submit" }}
            />
          ) : (
            <>
              <div className="grid gap-4">
                {schools.map((school) => <SchoolCard key={school.id} school={school} />)}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} searchParams={searchParams} />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
