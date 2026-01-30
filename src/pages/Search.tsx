import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { vaultIndex } from '../lib/data';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state with URL when it changes (e.g. from global search)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Focus search if / is pressed outside of an input
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(vaultIndex.notes, {
        keys: ['title', 'content', 'tags', 'excerpt'],
        threshold: 0.35
      }),
    []
  );

  const results = query ? fuse.search(query).map((result) => result.item) : vaultIndex.notes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Update URL as well to keep it in sync
    if (newQuery) {
      setSearchParams({ q: newQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <SectionHeader title="Search" subtitle="Browse and find exactly what you need." />

      <div className="relative">
        <input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          placeholder="Search notes, tags, ideas..."
          className="w-full rounded-2xl border border-border bg-surface/40 p-5 text-lg text-text outline-none transition-all duration-300 focus:border-accent focus:bg-surface/60 focus:shadow-glow-sm backdrop-blur-sm"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.2em] text-muted pointer-events-none">
          {results.length} matches
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {results.map((note) => (
          <Link key={note.slug} to={`/note/${note.slug}`} className="group block">
            <Card className="h-full transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accentSoft group-hover:shadow-glow-sm">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-display group-hover:text-accent transition-colors">{note.title}</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted group-hover:text-accent transition-colors">
                  Open
                </span>
              </div>
              <p className="mt-3 text-sm text-muted line-clamp-2 leading-relaxed">{note.excerpt}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-border/40 text-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted italic">No notes found matching your search.</p>
        </div>
      )}
    </div>
  );
}
