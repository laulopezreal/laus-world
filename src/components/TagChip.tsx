import { Link } from 'react-router-dom';
import clsx from 'clsx';

export function TagChip({ tag, className }: { tag: string; className?: string }) {
  return (
    <Link
      to={`/tags/${encodeURIComponent(tag)}`}
      className={clsx(
        'rounded-full border border-border bg-elevated/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted transition duration-300 ease-smooth hover:text-text',
        className
      )}
    >
      {tag}
    </Link>
  );
}
