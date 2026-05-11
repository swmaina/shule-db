import Link from "next/link";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export default function EmptyState({
  emoji = "🔍",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-6">
      <p className="text-5xl mb-4">{emoji}</p>
      <h3 className="font-display font-semibold text-lg text-stone-800 mb-2">{title}</h3>
      {description && (
        <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
