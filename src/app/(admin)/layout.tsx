import Link from "next/link";
import { GraduationCap, LayoutDashboard, ListChecks, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-stone-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-stone-700">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-sm">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            Elimu Finder
          </Link>
          <p className="text-stone-400 text-xs mt-1 font-medium">Admin panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/admin/moderate" icon={ListChecks} label="Moderation queue" />
        </nav>

        <div className="p-3 border-t border-stone-700">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 bg-stone-100">{children}</div>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 text-sm transition-colors"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
