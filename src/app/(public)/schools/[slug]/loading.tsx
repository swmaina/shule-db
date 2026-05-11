export default function SchoolLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="h-4 w-28 bg-stone-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-pulse">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="h-5 w-28 bg-stone-200 rounded-full mb-3" />
          <div className="h-8 w-2/3 bg-stone-200 rounded mb-2" />
          <div className="h-4 w-1/3 bg-stone-100 rounded" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[100, 130, 90, 80].map((h, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-4" style={{ height: h }} />
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-4 h-32" />
            <div className="bg-stone-200 rounded-xl h-56" />
          </div>
        </div>
      </div>
    </div>
  );
}
