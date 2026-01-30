import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { getNotesByTag } from '../lib/data';

export function TagDetail() {
  const { tag } = useParams();
  const decoded = tag ? decodeURIComponent(tag) : '';
  const notes = decoded ? getNotesByTag(decoded) : [];

  return (
    <div className="space-y-8">
      <SectionHeader title={`Tag: ${decoded}`} subtitle={`${notes.length} notes`} />
      <div className="grid gap-6 md:grid-cols-2">
        {notes.map((note) => (
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
