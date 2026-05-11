"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Hook for managing search filter state via URL search params.
 * Keeps filters in the URL so they are shareable and bookmarkable.
 */
export function useSchoolSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setFilter = useCallback(
    (key: string, value: string | string[] | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // reset pagination on filter change

      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  return { setFilter, clearAll, isPending };
}
