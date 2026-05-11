import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, PlusCircle, ArrowRight, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SCHOOL_TYPE_LABELS, CONDITION_LABELS, KENYA_COUNTIES } from "@/types";
import type { School } from "@/types";

export const metadata: Metadata = {
  title: "Elimu Finder — Schools for Neurodivergent Learners in Kenya",
};

// Counties with most SNE activity — shown in the county browser
const FEATURED_COUNTIES = [
  "Nairobi", "Kiambu", "Mombasa", "Kisumu", "Nakuru",
  "Uasin Gishu", "Machakos", "Meru", "Kakamega", "Nyeri",
];

async function getHomeData() {
  const supabase = await createClient();

  const [countResult, featuredResult] = await Promise.all([
    supabase
      .from("schools")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("schools")
      .select("id, slug, name, county, town, school_type, conditions_supported, is_verified, levels")
      .eq("status", "approved")
      .eq("is_verified", true)
      .order("last_verified_at", { ascending: false })
      .limit(3),
  ]);

  return {
    total: countResult.count ?? 0,
    featured: (featuredResult.data ?? []) as Partial<School>[],
  };
}

const TYPE_COLORS: Record<string, string> = {
  special:    "bg-purple-50 text-purple-700 border-purple-200",
  integrated: "bg-blue-50 text-blue-700 border-blue-200",
  inclusive:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default async function HomePage() {
  const { total, featured } = await getHomeData();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-brand-500 px-6 py-20 text-white overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-display font-semibold mb-6 border border-white/30">
            🇰🇪 Kenya's first neurodivergent school directory
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-5">
            Find the right school<br />
            <span className="text-white/80">for your child</span>
          </h1>

          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            A free, community-built directory of special, integrated, and inclusive
            schools for neurodivergent learners across all 47 counties.
          </p>

          {/* Search bar */}
          <form action="/search" className="flex gap-2 max-w-lg mx-auto mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                name="q"
                placeholder="School name, county, or condition…"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-stone-900 text-sm placeholder-stone-400 outline-none focus:ring-2 focus:ring-white/80 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-stone-900 hover:bg-stone-800 rounded-xl px-5 py-3 font-display font-semibold text-sm transition-colors shadow-lg whitespace-nowrap"
            >
              Search
            </button>
          </form>

          <p className="text-white/60 text-sm">
            {total > 0
              ? `${total} school${total !== 1 ? "s" : ""} listed across Kenya`
              : "Be the first to add a school"}
          </p>
        </div>
      </section>

      {/* ── School type quick-links ──────────────────────── */}
      <section className="bg-white border-b border-stone-200 px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">
          <span className="text-xs font-display font-semibold text-stone-400 uppercase tracking-widest mr-2 shrink-0">
            Browse by type
          </span>
          {Object.entries(SCHOOL_TYPE_LABELS).map(([type, label]) => (
            <Link
              key={type}
              href={`/search?type=${type}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 px-4 py-1.5 text-sm font-display font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/search"
            className="inline-flex items-center gap-1 ml-auto text-sm text-brand-600 font-display font-semibold hover:underline shrink-0"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="px-6 py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center mb-2">How Elimu Finder works</h2>
          <p className="text-stone-500 text-sm text-center mb-10">Three steps. Completely free.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                step: "01",
                title: "Search",
                desc: "Filter by county, condition, level, and school type. View results as a list or on a map.",
              },
              {
                icon: MapPin,
                step: "02",
                title: "Explore",
                desc: "View full school profiles — contact info, fee ranges, admission requirements, and more.",
              },
              {
                icon: PlusCircle,
                step: "03",
                title: "Contribute",
                desc: "Know a school not yet listed? Submit it in 2 minutes. School admins can claim and verify their listing.",
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <span className="font-display font-bold text-stone-300 text-xl">{step}</span>
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured verified schools ─────────────────────── */}
      {featured.length > 0 && (
        <section className="px-6 py-14 bg-white border-t border-stone-200">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl">Verified schools</h2>
                <p className="text-stone-500 text-sm">Confirmed up-to-date by school administrators</p>
              </div>
              <Link
                href="/search"
                className="text-sm text-brand-600 font-display font-semibold hover:underline inline-flex items-center gap-1"
              >
                Browse all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {featured.map((school) => (
                <Link
                  key={school.id}
                  href={`/schools/${school.slug}`}
                  className="group border border-stone-200 hover:border-brand-300 hover:shadow-md rounded-2xl p-5 transition-all block"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-xs font-display font-semibold px-2.5 py-0.5 rounded-full border ${
                        TYPE_COLORS[school.school_type ?? "special"]
                      }`}
                    >
                      {SCHOOL_TYPE_LABELS[school.school_type as keyof typeof SCHOOL_TYPE_LABELS]}
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <h3 className="font-display font-semibold text-sm group-hover:text-brand-600 transition-colors mb-1 line-clamp-2">
                    {school.name}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {school.town}, {school.county}
                  </p>
                  {school.conditions_supported && school.conditions_supported.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(school.conditions_supported as string[]).slice(0, 2).map((c) => (
                        <span key={c} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                          {CONDITION_LABELS[c as keyof typeof CONDITION_LABELS] ?? c}
                        </span>
                      ))}
                      {school.conditions_supported.length > 2 && (
                        <span className="text-xs text-stone-400">+{school.conditions_supported.length - 2}</span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Browse by county ─────────────────────────────── */}
      <section className="px-6 py-14 bg-stone-50 border-t border-stone-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl">Browse by county</h2>
              <p className="text-stone-500 text-sm">Find schools near you</p>
            </div>
            <Link
              href="/search"
              className="text-sm text-brand-600 font-display font-semibold hover:underline inline-flex items-center gap-1"
            >
              All counties <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {FEATURED_COUNTIES.map((county) => (
              <Link
                key={county}
                href={`/search?county=${encodeURIComponent(county)}`}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-brand-50 hover:border-brand-300 border border-stone-200 rounded-full px-4 py-2 text-sm font-display font-medium transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {county}
              </Link>
            ))}
            {/* Show a few more counties inline */}
            {KENYA_COUNTIES.filter((c) => !FEATURED_COUNTIES.includes(c))
              .slice(0, 8)
              .map((county) => (
                <Link
                  key={county}
                  href={`/search?county=${encodeURIComponent(county)}`}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-brand-50 hover:border-brand-300 border border-stone-200 rounded-full px-4 py-2 text-sm font-display font-medium text-stone-500 transition-colors"
                >
                  {county}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── Add a school CTA ──────────────────────────────── */}
      <section className="px-6 py-16 bg-brand-500 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display font-bold text-2xl mb-3">
            Know a school we're missing?
          </h2>
          <p className="text-white/75 text-sm mb-8 leading-relaxed">
            Every listing helps another family find the right fit.
            Submitting takes about 2 minutes and doesn't require an account.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-stone-50 font-display font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              Add a school
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white font-display font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
