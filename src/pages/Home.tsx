import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { TagChip } from '../components/TagChip';
import { getPinnedNotes, getRecentNotes } from '../lib/data';

export function Home() {
  const pinned = getPinnedNotes();
  const recent = getRecentNotes();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border bg-elevated/60 p-10 shadow-glow">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Obsidian Vault</p>
        <h1 className="mt-4 text-4xl font-display leading-tight md:text-5xl">
          Laura&apos;s World
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          A calm, luminous window into your notes — curated, connected, and ready for a
          midnight wander.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/search"
            className="rounded-full border border-border bg-accentSoft px-5 py-2 text-xs uppercase tracking-[0.3em] text-text transition duration-300 ease-smooth hover:shadow-glow"
          >
            Open Search
          </Link>
          <Link
            to="/graph"
            className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.3em] text-muted transition duration-300 ease-smooth hover:text-text"
          >
            View Graph
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Pinned notes"
          subtitle="Highlights tagged with #pin."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {pinned.length === 0 && (
            <Card>
              <p className="text-sm text-muted">No pinned notes yet.</p>
            </Card>
          )}
          {pinned.map((note) => (
            <Card key={note.slug}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display">{note.title}</h3>
                <Link className="text-xs uppercase tracking-[0.3em] text-accent" to={`/note/${note.slug}`}>
                  Read
                </Link>
              </div>
              <p className="mt-3 text-sm text-muted">{note.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Recent notes" subtitle="Latest updates from the vault." />
        <div className="grid gap-6 md:grid-cols-3">
          {recent.map((note) => (
            <Card key={note.slug} className="flex h-full flex-col">
              <h3 className="text-lg font-display">{note.title}</h3>
              <p className="mt-3 text-sm text-muted">{note.excerpt}</p>
              <div className="mt-auto pt-4">
                <Link className="text-xs uppercase tracking-[0.3em] text-accent" to={`/note/${note.slug}`}>
                  Continue
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Quick links" subtitle="Jump to curated views." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { to: '/tags', label: 'All Tags', copy: 'Browse by theme.' },
            { to: '/search', label: 'Search', copy: 'Find anything fast.' },
            { to: '/graph', label: 'Graph', copy: 'See the network.' }
          ].map((item) => (
            <Card key={item.to} className="space-y-2">
              <Link className="text-lg font-display" to={item.to}>
                {item.label}
              </Link>
              <p className="text-sm text-muted">{item.copy}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
