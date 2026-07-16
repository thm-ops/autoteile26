import {ProductView} from "@/app/domain/product/product.view";

// The ids mirror the seeded backend products so the PayPal "Buy now" button
// resolves to a real product record and the price is verified server-side.
export const products: ProductView[] = [
    {
        id: "a0000000-0000-4000-8000-000000000001",
        name: "Sommerreifen Premium",
        price: 8999,
        description: "Hochwertige Sommerreifen mit optimaler Bodenhaftung und Bremsverhalten."
    },
    {
        id: "a0000000-0000-4000-8000-000000000002",
        name: "Bremsscheiben Set",
        price: 12450,
        description: "Komplettes Bremsscheiben-Set für Vorder- und Hinterachse"
    },
    {
        id: "a0000000-0000-4000-8000-000000000003",
        name: "Autobatterie 12V 72Ah",
        price: 7995,
        description: "Zuverlässige Starterbatterie mit 5 Jahren Garantie"
    },
    {
        id: "a0000000-0000-4000-8000-000000000004",
        name: "Ölfilter Universal",
        description: "Hochwertiger Ölfilter für optimale Moterleistung",
        price: 1299
    },
    {
        id: "a0000000-0000-4000-8000-000000000005",
        name: "Zündkerzen Set (4-Stück)",
        description: "Langlebige Zündkerzen für zuverlässige Zündung",
        price: 3490
    },
    {
        id: "a0000000-0000-4000-8000-000000000006",
        name: "Luftfilter Sport",
        description: "Sportluftfilter für vebesserte Motorleistung",
        price: 2875
    }
]
