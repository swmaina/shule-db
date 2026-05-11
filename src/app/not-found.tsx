import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-6">🔍</p>
        <h1 className="font-display font-bold text-2xl mb-2">Page not found</h1>
        <p className="text-stone-500 text-sm mb-8">
          That page doesn't exist, or the school listing may have been removed.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/search"
            className="bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Search schools
          </Link>
          <Link
            href="/"
            className="border border-stone-300 hover:border-stone-400 text-stone-700 font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
