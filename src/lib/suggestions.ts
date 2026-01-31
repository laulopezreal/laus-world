import { vaultIndex } from './data';
import type { LinkSuggestion, SuggestedLink } from './types';

const DISMISS_KEY = 'laus-world-dismissed-suggestions';

export type SuggestionsIndex = Record<string, LinkSuggestion[]>;

const normalize = (value: string) => value.trim().toLowerCase();

const getSlugByTitle = (title: string) => {
  const match = vaultIndex.notes.find((note) => normalize(note.title) === normalize(title));
  return match?.slug;
};

const isValidSlug = (slug: string) =>
  vaultIndex.notes.some((note) => note.slug === slug);

const resolveTargetSlug = (target: string) =>
  isValidSlug(target) ? target : getSlugByTitle(target);

export async function loadSuggestions(): Promise<SuggestionsIndex> {
  const endpoints = ['/suggestions.json', '/generated/suggestions.json'];
  const errors: string[] = [];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      if (!res.ok) {
        errors.push(`${endpoint}: ${res.status}`);
        continue;
      }
      const json = (await res.json()) as SuggestionsIndex;
      return json ?? {};
    } catch (err) {
      errors.push(`${endpoint}: ${String(err)}`);
    }
  }
  if (errors.length > 0) {
    console.warn('Failed to load suggestions', errors);
  }
  return {};
}

export function getDismissed(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function dismissSuggestion(noteSlug: string, targetSlug: string) {
  if (typeof window === 'undefined') return;
  const dismissed = getDismissed();
  const current = new Set(dismissed[noteSlug] || []);
  current.add(targetSlug);
  dismissed[noteSlug] = Array.from(current);
  window.localStorage.setItem(DISMISS_KEY, JSON.stringify(dismissed));
}

export function getNoteSuggestions(
  noteSlug: string,
  suggestionsIndex: SuggestionsIndex
): LinkSuggestion[] {
  const dismissed = getDismissed()[noteSlug] || [];
  const dismissedSet = new Set(dismissed);
  const suggestions = suggestionsIndex[noteSlug] || [];
  return suggestions
    .filter((suggestion) => {
      const targetSlug = resolveTargetSlug(suggestion.target);
      if (!targetSlug) return false;
      return !dismissedSet.has(targetSlug);
    })
    .slice(0, 3);
}

export function getAllSuggestedLinks(
  suggestionsIndex: SuggestionsIndex
): SuggestedLink[] {
  const dismissed = getDismissed();
  const links: SuggestedLink[] = [];
  Object.entries(suggestionsIndex).forEach(([source, suggestions]) => {
    const dismissedSet = new Set(dismissed[source] || []);
    suggestions.forEach((suggestion) => {
      const targetSlug = resolveTargetSlug(suggestion.target);
      if (!targetSlug) return;
      if (dismissedSet.has(targetSlug)) return;
      links.push({ source, target: targetSlug });
    });
  });
  return links;
}
