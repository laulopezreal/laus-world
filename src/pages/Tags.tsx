import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { TagChip } from '../components/TagChip';
import { vaultIndex } from '../lib/data';

export function Tags() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Tags" subtitle="All topics across the vault." />
      <Card>
        <div className="flex flex-wrap gap-2">
          {vaultIndex.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      </Card>
    </div>
  );
}
