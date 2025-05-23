import CheckoutButton from './checkout-button';
import FreeTierButton from './free-tier-button';

interface PricingCardProps {
  name: string;
  description: string | null;
  price: number | null;
  interval: string | null;
  priceId: string | null;
  features: string[];
  isFree?: boolean;
}

function FeatureItem({ feature }: { feature: string }) {
  return (
    <li className="flex items-center text-sm">
      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      {feature}
    </li>
  );
}

export default function PricingCard({
  name,
  description,
  price,
  interval,
  priceId,
  features,
  isFree
}: PricingCardProps) {
  return (
    <div
      className={`border rounded-lg p-8 flex flex-col`}
    >
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="text-3xl font-bold mb-6">
        {price ? (
          <>
            ${price}
            <span className="text-lg font-normal text-muted-foreground">
              /{interval}
            </span>
          </>
        ) : (
          'Free'
        )}
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold mb-4">Features</h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </ul>
      </div>
      <div className="mt-8">
        {isFree ? (
          <FreeTierButton />
        ) : (
          <CheckoutButton priceId={priceId!} />
        )}
      </div>
    </div>
  );
} 