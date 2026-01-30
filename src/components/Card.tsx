import { ReactNode } from 'react';
import clsx from 'clsx';

type CardVariant = 'hero' | 'default' | 'flat';

export function Card({
  children,
  className,
  variant = 'default'
}: {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}) {
  return (
    <div
      className={clsx(
        'rounded-2xl border overflow-hidden',
        {
          // Hero: strongest depth with subtle border glow
          'border-border/60 bg-surface/40 p-12 shadow-hero backdrop-blur-sm': variant === 'hero',
          // Default: medium depth for section cards
          'border-border bg-surface/80 p-6 shadow-cardDefault backdrop-blur motion-float': variant === 'default',
          // Flat: minimal shadow for flat surfaces
          'border-border/30 bg-surface/60 p-6 shadow-flat': variant === 'flat'
        },
        className
      )}
    >
      {children}
    </div>
  );
}
