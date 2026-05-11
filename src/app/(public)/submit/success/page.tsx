import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "School submitted!" };

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-3">
          School submitted — thank you!
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-8">
          We'll review the listing within 48 hours. Once approved, it'll appear in search
          results and help families find the right school. If we need to clarify anything,
          we'll reach out on the email you provided.
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left mb-8">
          <p className="font-display font-semibold text-sm mb-2">Are you the school administrator?</p>
          <p className="text-stone-500 text-xs leading-relaxed">
            Once your school is approved, you can claim the listing to keep details
            up to date, add photos, and get a Verified badge. Look out for an email
            from us, or{" "}
            <a href="mailto:hello@elimufinder.co.ke" className="text-brand-600 underline">
              get in touch
            </a>{" "}
            to fast-track your claim.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/submit"
            className="border border-stone-300 hover:border-stone-400 text-stone-700 font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Add another school
          </Link>
          <Link
            href="/search"
            className="bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Browse schools
          </Link>
        </div>
      </div>
    </div>
  );
}
