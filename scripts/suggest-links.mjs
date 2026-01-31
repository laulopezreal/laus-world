import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const indexPath = path.resolve('src/generated/index.json');
const outputPath = path.resolve('public/suggestions.json');

const normalize = (value) => value.trim().toLowerCase();

const main = async () => {
  const raw = await readFile(indexPath, 'utf-8');
  const index = JSON.parse(raw);
  const notes = index.notes || [];

  const titleMap = new Map(
    notes.map((note) => [normalize(note.title), { slug: note.slug, title: note.title }])
  );

  const suggestions = {};

  notes.forEach((note) => {
    const content = normalize(note.content || '');
    const candidates = [];

    titleMap.forEach((value, titleKey) => {
      if (value.slug === note.slug) return;
      if (content.includes(titleKey)) {
        candidates.push({
          target: value.slug,
          targetTitle: value.title,
          reason: `The note explicitly mentions "${value.title}".`,
          confidence: 'medium'
        });
      }
    });

    suggestions[note.slug] = candidates.slice(0, 3);
  });

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(suggestions, null, 2));
  console.log(`Wrote suggestions to ${outputPath}`);
};

main().catch((err) => {
  console.error('Failed to generate suggestions:', err);
  process.exit(1);
});
