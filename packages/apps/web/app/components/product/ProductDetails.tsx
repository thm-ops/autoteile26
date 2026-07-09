import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/app/utils/formatPrice';
import { ProductView } from '@/app/domain/product';
import PayPalInstantBuyButton from '@/app/components/paypal/InstantPayButtonPaypal';

type ProductDetailsProps = {
  product: ProductView;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const formattedPrice = formatPrice(product.price);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-600 hover:underline">
        Zurück zur Übersicht
      </Link>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        <div className="rounded overflow-hidden shadow-lg bg-card">
          <Image
            src={product.image || 'https://placehold.co/600x400'}
            width={600}
            height={400}
            alt={product.imageAlt || product.name}
            unoptimized={true}
            className="w-full h-auto"
          />
        </div>

        <div>
          <h1 className="font-bold text-3xl mb-4">{product.name}</h1>

          <p className="text-foreground text-lg mb-6">{product.description}</p>

          <p className="text-2xl font-semibold mb-8">{formattedPrice}</p>

          <PayPalInstantBuyButton productId={product.id} />
        </div>
      </section>
    </main>
  );
}
