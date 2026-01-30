import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { TagChip } from '../components/TagChip';
import { getPinnedNotes, getRecentNotes } from '../lib/data';

export function Home() {
  const pinned = getPinnedNotes();
  const recent = getRecentNotes();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface/40 p-12 shadow-hero backdrop-blur-sm">
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-semibold">Discovery</p>
          <h1 className="mt-4 text-5xl font-display leading-[1.1] md:text-6xl tracking-tight">
            A living map of thoughts
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed font-light">
            Notes, questions, and connections — slowly growing.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/graph"
              className="group flex items-center gap-3 rounded-full border border-border/60 bg-transparent px-8 py-3 text-xs uppercase tracking-[0.3em] text-muted transition-all duration-500 hover:border-accent/40 hover:text-accent hover:bg-accent/5 hover:shadow-glow-sm"
            >
              Explore Graph
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Subtle decorative element */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </section>

      <section>
        <SectionHeader
          title="Pinned highlights"
          subtitle="Fixed thoughts that light the way."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {pinned.length === 0 && (
            <Card className="flex items-center justify-center py-12 border-dashed">
              <p className="text-sm text-muted italic">No pinned notes yet. Add #pin to any note.</p>
            </Card>
          )}
          {pinned.map((note) => (
            <Link key={note.slug} to={`/note/${note.slug}`} className="group block h-full">
              <Card className="h-full border-border/40 group-hover:border-accent group-hover:bg-accentSoft group-hover:shadow-glow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display group-hover:text-accent transition-colors">{note.title}</h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    Read
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted line-clamp-2 leading-relaxed">{note.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Latest updates" subtitle="The pulse of your recent thoughts." />
        <div className="grid gap-6 md:grid-cols-3">
          {recent.map((note) => (
            <Link key={note.slug} to={`/note/${note.slug}`} className="group block h-full">
              <Card className="flex h-full flex-col border-border/40 group-hover:border-accent/40 group-hover:bg-accentSoft">
                <h3 className="text-lg font-display group-hover:text-accent transition-colors">{note.title}</h3>
                <p className="mt-3 text-sm text-muted line-clamp-3 leading-relaxed">{note.excerpt}</p>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold group-hover:text-accent transition-colors">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-1 group-hover:translate-x-0">
                    Continue →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-10">
        <SectionHeader title="Collections" subtitle="Navigate your digital garden." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { to: '/tags', label: 'All Tags', copy: 'Browse by theme.' },
            { to: '/graph', label: 'Knowledge Graph', copy: 'See the network.' }
          ].map((item) => (
            <Link key={item.to} to={item.to} className="group block">
              <Card className="space-y-2 border-border/40 group-hover:border-accent group-hover:bg-accentSoft">
                <h3 className="text-xl font-display group-hover:text-accent transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-muted font-light">{item.copy}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
