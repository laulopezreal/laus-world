import fg from 'fast-glob';
import matter from 'gray-matter';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const vaultDir = path.resolve('vault');
const outputPath = path.resolve('src/generated/index.json');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\.md$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const extractExcerpt = (content) => {
  const plain = content
    .replace(/\[\^\d+\]/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/[#>*_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.split(' ').slice(0, 28).join(' ');
};

const extractLinks = (content) => {
  const links = [];
  const wikiRegex = /\[\[([^\]|]+)(\|([^\]]+))?\]\]/g;
  const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  let match;
  while ((match = wikiRegex.exec(content))) {
    links.push({
      label: match[3] || match[1],
      target: match[1],
      type: 'wikilink'
    });
  }

  while ((match = mdRegex.exec(content))) {
    const target = match[2];
    if (target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('#')) {
      continue;
    }
    links.push({
      label: match[1],
      target,
      type: 'markdown'
    });
  }

  return links;
};

const files = await fg('**/*.md', { cwd: vaultDir });
const notes = [];

for (const file of files) {
  const absolute = path.join(vaultDir, file);
  const raw = await readFile(absolute, 'utf-8');
  const { data, content } = matter(raw);
  const title = data.title || path.basename(file, '.md');
  const slug = slugify(file);
  const tags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === 'string'
      ? data.tags.split(',').map((tag) => tag.trim())
      : [];

  const links = extractLinks(content);

  notes.push({
    slug,
    path: file,
    title,
    excerpt: extractExcerpt(content),
    tags,
    created: data.created,
    updated: data.updated,
    cover: data.cover,
    content,
    links,
    backlinks: []
  });
}

const titleMap = new Map();
const basenameMap = new Map();
const pathMap = new Map();

for (const note of notes) {
  titleMap.set(note.title.toLowerCase(), note.slug);
  basenameMap.set(path.basename(note.path, '.md').toLowerCase(), note.slug);
  pathMap.set(note.path.replace(/\.md$/i, '').toLowerCase(), note.slug);
}

const resolveTarget = (target) => {
  const cleaned = target.replace(/\.md$/i, '').trim();
  const lower = cleaned.toLowerCase();
  if (pathMap.has(lower)) return pathMap.get(lower);
  if (titleMap.has(lower)) return titleMap.get(lower);
  if (basenameMap.has(lower)) return basenameMap.get(lower);
  return slugify(cleaned);
};

for (const note of notes) {
  note.links = note.links.map((link) => ({
    ...link,
    target: resolveTarget(link.target)
  }));
}

for (const note of notes) {
  for (const link of note.links) {
    const targetNote = notes.find((item) => item.slug === link.target);
    if (targetNote) {
      targetNote.backlinks.push({
        target: note.slug,
        label: note.title,
        type: link.type
      });
    }
  }
}

const tags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort();

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), notes, tags }, null, 2)
);

console.log(`Indexed ${notes.length} notes.`);
