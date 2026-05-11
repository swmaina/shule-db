export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-stone-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 w-32 bg-stone-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-24 bg-stone-100 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {[80, 120, 160, 200].map((h) => (
            <div key={h} className="space-y-2">
              <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
              <div className={`bg-stone-100 rounded-xl animate-pulse`} style={{ height: h }} />
            </div>
          ))}
        </aside>

        {/* Cards skeleton */}
        <section className="flex-1 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-stone-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-2/3 bg-stone-200 rounded" />
                  <div className="h-4 w-1/3 bg-stone-100 rounded" />
                  <div className="flex gap-2 mt-3">
                    {[60, 80, 70].map((w) => (
                      <div key={w} className="h-6 bg-stone-100 rounded-full" style={{ width: w }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
