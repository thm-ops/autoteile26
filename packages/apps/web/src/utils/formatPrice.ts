export function formatPrice(priceInCents: number, locale = "de-DE", currency = "EUR") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(priceInCents / 100);
}
