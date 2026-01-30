import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { vaultIndex } from '../lib/data';
import { Link } from 'react-router-dom';

export function Search() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === '/') {
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

  return (
    <div className="space-y-8">
      <SectionHeader title="Search" subtitle="Press / to focus." />
      <Card>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes, tags, ideas..."
          className="w-full rounded-xl border border-border bg-elevated/60 px-4 py-3 text-sm text-text outline-none transition focus:border-accent"
        />
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">
          {results.length} matches
        </p>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        {results.map((note) => (
          <Card key={note.slug}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display">{note.title}</h3>
              <Link className="text-xs uppercase tracking-[0.3em] text-accent" to={`/note/${note.slug}`}>
                Read
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted">{note.excerpt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
