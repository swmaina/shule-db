"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">😔</p>
        <h2 className="font-display font-bold text-xl mb-2">Something went wrong</h2>
        <p className="text-stone-500 text-sm mb-6">
          An unexpected error occurred. Please try again — if it keeps happening,
          contact us at hello@elimufinder.co.ke.
        </p>
        <button
          onClick={reset}
          className="bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
