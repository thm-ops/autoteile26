import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <p className="text-sm text-slate-500">
          © {year} MeinShop Autoteile GmbH
        </p>

        {/* Legal links */}
        <nav className="flex items-center gap-6">
          <Link href="/impressum" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Impressum
          </Link>
        </nav>

      </div>
    </footer>
  );
}
