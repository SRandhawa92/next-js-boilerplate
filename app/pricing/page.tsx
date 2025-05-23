import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PricingCard from '@/components/pricing-card';
import type { Stripe } from 'stripe';

type ProductWithPrice = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  interval: string | null;
  priceId: string | null;
  features: string[];
  isFree?: boolean;
};

async function getProductsAndPrices(): Promise<ProductWithPrice[]> {
  const products = await stripe.products.list();
  const prices = await stripe.prices.list();
  


  const paidProducts = products.data.map((product: Stripe.Product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: prices.data.find((price: Stripe.Price) => price.product === product.id)?.unit_amount! / 100,
    interval: prices.data.find((price: Stripe.Price) => price.product === product.id)?.recurring?.interval ?? null,
    priceId: prices.data.find((price: Stripe.Price) => price.product === product.id)?.id,
    features: product.marketing_features.map((feature: Stripe.Product.MarketingFeature) => feature.name),
  }));

  // log the features
  console.log(products.data.map((product: ProductWithPrice) => product.features));

  const freeTier: ProductWithPrice = {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: null,
    interval: null,
    priceId: null,
    features: [
      'Basic features',
    ],
    isFree: true
  };

  return [freeTier, ...paidProducts];
}

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const products = await getProductsAndPrices();

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <PricingCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
} 