import { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-surface/80 p-6 shadow-soft backdrop-blur motion-float overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}
