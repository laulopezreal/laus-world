import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LinkSuggestion } from '../lib/types';

type SuggestedLinksSectionProps = {
  noteSlug: string;
  suggestions: LinkSuggestion[];
  onAccept: (suggestion: LinkSuggestion) => void;
  onDismiss: (suggestion: LinkSuggestion) => void;
  autoOpen?: boolean;
};

export function SuggestedLinksSection({
  noteSlug,
  suggestions,
  onAccept,
  onDismiss,
  autoOpen = false
}: SuggestedLinksSectionProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const countLabel = useMemo(
    () => (suggestions.length > 0 ? `Suggested connections (${suggestions.length})` : 'Suggested connections'),
    [suggestions.length]
  );

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-surface/70 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display">{countLabel}</h2>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-xs uppercase tracking-[0.2em] text-muted transition hover:text-text"
          aria-expanded={isOpen}
          aria-controls={`suggested-links-${noteSlug}`}
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <ul
          id={`suggested-links-${noteSlug}`}
          className="mt-4 space-y-3 text-sm text-muted"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.target} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Link
                    to={`/note/${suggestion.target}`}
                    className="text-accent"
                  >
                    {suggestion.targetTitle || suggestion.target}
                  </Link>
                  <p className="mt-2 text-xs text-muted">{suggestion.reason}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAccept(suggestion)}
                    className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted transition hover:border-accent hover:text-accent"
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => onDismiss(suggestion)}
                    className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-text"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
