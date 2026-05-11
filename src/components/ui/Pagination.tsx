import Link from "next/link";
import { cn } from "@/lib/utils/helpers";

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Pagination({ currentPage, totalPages, searchParams }: Props) {
  function buildUrl(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k === "page") return;
      if (Array.isArray(v)) v.forEach((item) => params.append(k, item));
      else if (v) params.set(k, v);
    });
    params.set("page", String(page));
    return `/search?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-stone-100 text-stone-600">
          ← Prev
        </Link>
      )}

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <>
            {prev && p - prev > 1 && (
              <span key={`ellipsis-${p}`} className="px-2 text-stone-400">…</span>
            )}
            <Link
              key={p}
              href={buildUrl(p)}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                p === currentPage
                  ? "bg-brand-500 text-white"
                  : "hover:bg-stone-100 text-stone-600"
              )}
            >
              {p}
            </Link>
          </>
        );
      })}

      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)}
          className="px-3 py-2 text-sm rounded-lg hover:bg-stone-100 text-stone-600">
          Next →
        </Link>
      )}
    </div>
  );
}
