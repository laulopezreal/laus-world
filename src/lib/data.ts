import index from '../generated/index.json';
import type { VaultIndex } from './types';

export const vaultIndex = index as VaultIndex;

export const getNoteBySlug = (slug: string) =>
  vaultIndex.notes.find((note) => note.slug === slug);

export const getNotesByTag = (tag: string) =>
  vaultIndex.notes.filter((note) => note.tags.includes(tag));

export const getPinnedNotes = () => getNotesByTag('pin');

export const getRecentNotes = (limit = 6) =>
  [...vaultIndex.notes]
    .sort((a, b) => (b.updated || b.created || '').localeCompare(a.updated || a.created || ''))
    .slice(0, limit);
