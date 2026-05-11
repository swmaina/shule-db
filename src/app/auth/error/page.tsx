import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🔐</p>
        <h1 className="font-display font-bold text-xl mb-2">Authentication failed</h1>
        <p className="text-stone-500 text-sm mb-6">
          The login link may have expired or already been used. Please try again.
        </p>
        <Link
          href="/admin/login"
          className="bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors inline-block"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
