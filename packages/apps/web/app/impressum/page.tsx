import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | MeinShop",
  description: "Impressum und Anbieterkennzeichnung der MeinShop Autoteile GmbH gemäß § 5 DDG.",
  robots: { index: true, follow: false },
};

export default function Impressum() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Impressum</h1>

      {/* Provider information (§ 5 DDG) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Angaben gemäß § 5 DDG</h2>
        <p className="text-slate-700 leading-relaxed">
          MeinShop Autoteile GmbH<br />
          Industriestraße 26<br />
          35390 Gießen<br />
          Deutschland
        </p>
      </div>

      {/* Authorised representatives */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Vertreten durch</h2>
        <p className="text-slate-700 leading-relaxed">
          Erika Mustermann (Geschäftsführerin)<br />
          Max Mustermann (Geschäftsführer)
        </p>
      </div>

      {/* Contact */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Kontakt</h2>
        <p className="text-slate-700 leading-relaxed">
          Telefon: +49 641 1234567<br />
          Telefax: +49 641 1234568<br />
          E-Mail:{" "}
          <a href="mailto:info@meinshop-autoteile.de" className="text-blue-600 hover:text-blue-700">
            info@meinshop-autoteile.de
          </a>
        </p>
      </div>

      {/* Commercial register entry */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Registereintrag</h2>
        <p className="text-slate-700 leading-relaxed">
          Eintragung im Handelsregister<br />
          Registergericht: Amtsgericht Gießen<br />
          Registernummer: HRB 12345
        </p>
      </div>

      {/* VAT ID */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Umsatzsteuer-ID</h2>
        <p className="text-slate-700 leading-relaxed">
          Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
          DE123456789
        </p>
      </div>

      {/* Person responsible for content (§ 18 Abs. 2 MStV) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Redaktionell verantwortlich gemäß § 18 Abs. 2 MStV
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Erika Mustermann<br />
          Industriestraße 26<br />
          35390 Gießen
        </p>
      </div>

      {/* EU online dispute resolution */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">EU-Streitschlichtung</h2>
        <p className="text-slate-700 leading-relaxed">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
      </div>

      {/* Consumer dispute resolution */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Verbraucherstreitbeilegung / Universalschlichtungsstelle
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </section>
  );
}
