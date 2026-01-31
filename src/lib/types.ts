export type Frontmatter = {
  title?: string;
  tags?: string[];
  created?: string;
  updated?: string;
  cover?: string;
};

export type NoteLink = {
  target: string;
  label: string;
  type: 'wikilink' | 'markdown';
};

export type NoteRecord = {
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  tags: string[];
  created?: string;
  updated?: string;
  cover?: string;
  content: string;
  links: NoteLink[];
  backlinks: NoteLink[];
};

export type LinkSuggestion = {
  target: string;
  targetTitle: string;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
};

export type SuggestedLink = {
  source: string;
  target: string;
};

export type VaultIndex = {
  generatedAt: string;
  notes: NoteRecord[];
  tags: string[];
};
