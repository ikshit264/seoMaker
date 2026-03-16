export interface PricingCardProps {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export interface BentoItemProps {
  title: string;
  description: string;
  icon: any;
  className?: string;
  colorClass?: string;
}
