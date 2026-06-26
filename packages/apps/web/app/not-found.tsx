import Link from "next/link";

export default function NotFound() {
    return (
        <main className="max-w-5xl mx-auto px-4 py-20 text-center">
            <p className="text-6xl font-bold text-slate-900 mb-4">404</p>

            <h1 className="text-2xl font-semibold mb-3">
                Seite nicht gefunden
            </h1>

            <p className="text-slate-600 mb-8">
                Die gesuchte Seite oder das Produkt existiert nicht oder ist nicht mehr verfügbar.
            </p>

            <Link
                href="/"
                className="inline-block rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
                Zurück zur Startseite
            </Link>
        </main>
    );
}
