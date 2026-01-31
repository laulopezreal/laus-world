import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { MarkdownContent } from '../components/MarkdownContent';
import { TagChip } from '../components/TagChip';
import { ReadingProgress } from '../components/ReadingProgress';
import { SuggestedLinksSection } from '../components/SuggestedLinksSection';
import { getNoteBySlug, vaultIndex } from '../lib/data';
import { dismissSuggestion, getNoteSuggestions, loadSuggestions } from '../lib/suggestions';
import type { LinkSuggestion } from '../lib/types';

export function Note() {
  const { slug } = useParams();
  const note = slug ? getNoteBySlug(slug) : undefined;
  const [noteSuggestions, setNoteSuggestions] = useState<LinkSuggestion[]>([]);
  const [copiedMessage, setCopiedMessage] = useState('');

  if (!note) {
    return (
      <Card>
        <p className="text-sm text-muted">Note not found.</p>
      </Card>
    );
  }

  const noteIndex = vaultIndex.notes.findIndex((item) => item.slug === note.slug);
  const prev = vaultIndex.notes[noteIndex - 1];
  const next = vaultIndex.notes[noteIndex + 1];

  useEffect(() => {
    let isActive = true;
    loadSuggestions().then((index) => {
      if (!isActive) return;
      setNoteSuggestions(getNoteSuggestions(note.slug, index));
    });
    return () => {
      isActive = false;
    };
  }, [note.slug]);

  const handleAcceptSuggestion = async (suggestion: LinkSuggestion) => {
    const linkText = `[[${suggestion.targetTitle || suggestion.target}]]`;
    try {
      await navigator.clipboard.writeText(linkText);
      setCopiedMessage('Link copied. Paste it where you want it.');
    } catch {
      setCopiedMessage('Unable to copy link automatically.');
    }
    window.setTimeout(() => setCopiedMessage(''), 2500);
  };

  const handleDismissSuggestion = (suggestion: LinkSuggestion) => {
    dismissSuggestion(note.slug, suggestion.target);
    setNoteSuggestions((current) =>
      current.filter((item) => item.target !== suggestion.target)
    );
  };

  return (
    <div>
      <ReadingProgress content={note.content} />
      <div className="space-y-8">
        <section className="rounded-3xl border border-border bg-surface/80 p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{note.path}</p>
          <h1 className="mt-4 text-3xl font-display md:text-4xl">{note.title}</h1>
          <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-muted">
            {note.created && <span>Created {note.created}</span>}
            {note.updated && <span>Updated {note.updated}</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
            <Link
              to="/graph"
              state={{ noteSlug: note.slug }}
              className="ml-auto rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted transition duration-300 ease-smooth hover:border-accent hover:text-accent"
            >
              View in Graph
            </Link>
          </div>
        </section>

        <Card>
          <MarkdownContent content={note.content} />
        </Card>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-lg font-display">Backlinks</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {note.backlinks.length === 0 && <li>No backlinks yet.</li>}
              {note.backlinks.map((link, index) => (
                <li key={`${link.target}-${index}`}>
                  <Link to={`/note/${link.target}`} className="text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-lg font-display">Related links</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {note.links.length === 0 && <li>No outbound links yet.</li>}
              {note.links.map((link, index) => (
                <li key={`${link.target}-${index}`}>
                  <Link to={`/note/${link.target}`} className="text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <SuggestedLinksSection
          noteSlug={note.slug}
          suggestions={noteSuggestions}
          onAccept={handleAcceptSuggestion}
          onDismiss={handleDismissSuggestion}
          autoOpen={note.links.length === 0}
        />

        {copiedMessage && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {copiedMessage}
          </p>
        )}

        <section className="flex flex-wrap gap-4">
          {prev && (
            <Link
              to={`/note/${prev.slug}`}
              className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted transition duration-300 ease-smooth hover:text-text"
            >
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link
              to={`/note/${next.slug}`}
              className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted transition duration-300 ease-smooth hover:text-text"
            >
              {next.title} →
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
