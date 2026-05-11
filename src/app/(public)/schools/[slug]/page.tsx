import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Globe, CheckCircle,
  AlertTriangle, Share2, ArrowLeft, Clock
} from "lucide-react";
import { getSchoolBySlug } from "@/lib/utils/schools";
import {
  SCHOOL_TYPE_LABELS, LEVEL_LABELS, CONDITION_LABELS, FEE_RANGE_LABELS
} from "@/types";
import { isStale, timeAgo, buildWhatsAppShareUrl } from "@/lib/utils/helpers";
import SchoolMap from "@/components/map/SchoolMap";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const school = await getSchoolBySlug(params.slug);
  if (!school) return { title: "School not found" };
  return {
    title: school.name,
    description: `${SCHOOL_TYPE_LABELS[school.school_type]} in ${school.town}, ${school.county}. Supporting: ${school.conditions_supported.slice(0, 3).map(c => CONDITION_LABELS[c]).join(", ")}.`,
  };
}

export default async function SchoolPage({ params }: PageProps) {
  const school = await getSchoolBySlug(params.slug);
  if (!school) notFound();

  const stale = isStale(school.last_verified_at);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://elimufinder.co.ke";
  const schoolUrl = `${appUrl}/schools/${school.slug}`;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Back nav */}
      <div className="bg-white border-b border-stone-200 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Stale warning */}
        {stale && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">This listing may be outdated</p>
              <p className="text-amber-700">
                Last verified {school.last_verified_at ? timeAgo(school.last_verified_at) : "unknown"}.
                Please call the school to confirm details before visiting.
              </p>
            </div>
          </div>
        )}

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-block bg-brand-100 text-brand-700 text-xs font-display font-semibold px-3 py-1 rounded-full">
                  {SCHOOL_TYPE_LABELS[school.school_type]}
                </span>
                {school.is_verified && (
                  <span className="inline-flex items-center gap-1 bg-forest-500/10 text-forest-600 text-xs font-display font-semibold px-3 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl">{school.name}</h1>
              <p className="text-stone-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 shrink-0" />
                {[school.estate, school.town, school.county].filter(Boolean).join(", ")}
              </p>
            </div>

            {/* Share button */}
            <a
              href={buildWhatsAppShareUrl(school.name, schoolUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-display font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </a>
          </div>

          {school.description && (
            <p className="mt-4 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-4">
              {school.description}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Details */}
          <div className="space-y-4">
            {/* Levels */}
            <InfoBlock title="Education levels">
              <div className="flex flex-wrap gap-2">
                {school.levels.map((l) => (
                  <span key={l} className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {LEVEL_LABELS[l]}
                  </span>
                ))}
              </div>
            </InfoBlock>

            {/* Conditions */}
            <InfoBlock title="Conditions supported">
              <div className="flex flex-wrap gap-2">
                {school.conditions_supported.map((c) => (
                  <span key={c} className="bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {CONDITION_LABELS[c]}
                  </span>
                ))}
              </div>
            </InfoBlock>

            {/* Fees */}
            {school.fee_range && (
              <InfoBlock title="Fee range">
                <p className="text-sm text-stone-700">{FEE_RANGE_LABELS[school.fee_range]}</p>
                {school.fee_notes && (
                  <p className="text-xs text-stone-500 mt-1">{school.fee_notes}</p>
                )}
              </InfoBlock>
            )}

            {/* Boarding */}
            <InfoBlock title="Boarding">
              <p className="text-sm text-stone-700">
                {school.is_boarding ? "Boarding available" : "Day school only"}
              </p>
            </InfoBlock>

            {/* Admission requirements */}
            {school.admission_requirements && (
              <InfoBlock title="Admission requirements">
                <p className="text-sm text-stone-600 leading-relaxed">{school.admission_requirements}</p>
              </InfoBlock>
            )}
          </div>

          {/* Contact + Map */}
          <div className="space-y-4">
            <InfoBlock title="Contact">
              <div className="space-y-2">
                {school.phone && (
                  <a href={`tel:${school.phone}`} className="flex items-center gap-2 text-sm hover:text-brand-600">
                    <Phone className="w-4 h-4 text-stone-400" /> {school.phone}
                  </a>
                )}
                {school.email && (
                  <a href={`mailto:${school.email}`} className="flex items-center gap-2 text-sm hover:text-brand-600">
                    <Mail className="w-4 h-4 text-stone-400" /> {school.email}
                  </a>
                )}
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-brand-600">
                    <Globe className="w-4 h-4 text-stone-400" /> Visit website
                  </a>
                )}
              </div>
            </InfoBlock>

            {/* Map */}
            {school.lat && school.lng && (
              <div className="rounded-xl overflow-hidden border border-stone-200">
                <SchoolMap lat={school.lat} lng={school.lng} name={school.name} />
              </div>
            )}

            {/* Last verified */}
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Clock className="w-3.5 h-3.5" />
              Last verified: {school.last_verified_at ? timeAgo(school.last_verified_at) : "Unknown"}
            </div>
          </div>
        </div>

        {/* Suggest edit */}
        <div className="bg-stone-100 rounded-xl p-4 text-sm text-center">
          <p className="text-stone-600">
            Something wrong or outdated?{" "}
            <Link href={`/submit?suggest=${school.id}`} className="text-brand-600 font-semibold hover:underline">
              Suggest an edit
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <p className="text-xs font-display font-semibold text-stone-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}
