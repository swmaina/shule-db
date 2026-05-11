import Link from "next/link";
import { GraduationCap, Menu, PlusCircle } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Site nav ── */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-stone-900 hover:text-brand-600 transition-colors">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base">Elimu Finder</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/search" className="px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">
              Browse schools
            </Link>
            <Link href="/about" className="px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">
              About
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold text-sm px-3.5 py-2 rounded-xl transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add a school</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-stone-200 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-display font-bold text-stone-900 mb-1">
                <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                </div>
                Elimu Finder
              </div>
              <p className="text-stone-400 text-xs max-w-xs">
                A free, community-built directory of schools for neurodivergent learners across Kenya's 47 counties.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
              <Link href="/search" className="hover:text-stone-800 transition-colors">Browse schools</Link>
              <Link href="/submit" className="hover:text-stone-800 transition-colors">Add a school</Link>
              <Link href="/about" className="hover:text-stone-800 transition-colors">About</Link>
              <a href="mailto:hello@elimufinder.co.ke" className="hover:text-stone-800 transition-colors">Contact</a>
            </nav>
          </div>

          <div className="border-t border-stone-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
            <p>© {new Date().getFullYear()} Elimu Finder. Free to use. Always.</p>
            <p>Built with ❤️ for Kenyan families</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
