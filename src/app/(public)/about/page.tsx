import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Shield, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Elimu Finder",
  description:
    "Why we built a free directory of special, integrated, and inclusive schools for neurodivergent learners in Kenya.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-12">
        <span className="inline-block bg-brand-100 text-brand-700 text-xs font-display font-semibold px-3 py-1 rounded-full mb-4">
          Our story
        </span>
        <h1 className="font-display font-bold text-4xl leading-tight mb-4">
          Every child deserves<br />to be found
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          In Kenya, tens of thousands of neurodivergent children are either out of school
          or in the wrong school — not because the right school doesn't exist, but because
          parents couldn't find it. Elimu Finder exists to close that gap.
        </p>
      </div>

      {/* Problem */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-xl mb-4">The problem we're solving</h2>
        <div className="prose prose-stone text-stone-600 leading-relaxed space-y-4 text-sm">
          <p>
            Parents of children with autism, ADHD, dyslexia, cerebral palsy, hearing impairments,
            and other neurodivergent conditions face an exhausting search process. Word of mouth,
            Facebook groups, and expensive consultations with educational psychologists are often
            the only ways to find a suitable school.
          </p>
          <p>
            Meanwhile, special schools, integrated units in mainstream schools, and inclusive
            schools sit half-empty in some counties — because the families who need them most
            don't know they exist.
          </p>
          <p>
            The Ministry of Education maintains some SNE registers, but they are not publicly
            searchable, often out of date, and don't cover integrated units or inclusive
            mainstream schools at all.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-xl mb-6">Our principles</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: Heart,
              title: "Parents never pay",
              desc: "The directory is and always will be free for families. No paywalls, no premium search, no ads.",
            },
            {
              icon: Users,
              title: "Community-powered",
              desc: "Schools are added by parents, teachers, and administrators. Everyone who knows a school can contribute.",
            },
            {
              icon: Shield,
              title: "Trust through transparency",
              desc: "Every listing shows when it was last verified. Stale listings are flagged, not hidden.",
            },
            {
              icon: TrendingUp,
              title: "Social enterprise",
              desc: "We sustain the platform through school subscriptions, grants, and CSR partnerships — not by monetising families.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
              <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-brand-600" />
              </div>
              <h3 className="font-display font-semibold mb-1">{title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we list */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-xl mb-4">What we list</h2>
        <div className="space-y-3 text-sm text-stone-600">
          {[
            ["Special schools", "Schools exclusively for learners with specific disabilities or conditions."],
            ["Integrated units", "SNE units within mainstream schools where learners can access both environments."],
            ["Inclusive mainstream schools", "Mainstream schools with learning support departments that accommodate neurodivergent learners."],
            ["TVETs & tertiary institutions", "Vocational training and higher education institutions with disability support services."],
          ].map(([term, def]) => (
            <div key={term as string} className="flex gap-3">
              <span className="font-display font-semibold text-stone-900 w-52 shrink-0">{term}</span>
              <span>{def}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center">
        <h2 className="font-display font-bold text-xl mb-2">Help us grow the directory</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
          Know a school that should be listed? Every submission makes the directory more useful
          for the next family searching.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Add a school
          </Link>
          <a
            href="mailto:hello@elimufinder.co.ke"
            className="inline-flex items-center gap-2 border border-stone-300 hover:border-stone-400 text-stone-700 font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  );
}
