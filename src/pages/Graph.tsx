import { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { vaultIndex } from '../lib/data';

export function Graph() {
  const graphData = useMemo(() => {
    const nodes = vaultIndex.notes.map((note) => ({
      id: note.slug,
      name: note.title
    }));
    const links = vaultIndex.notes.flatMap((note) =>
      note.links.map((link) => ({
        source: note.slug,
        target: link.target
      }))
    );
    return { nodes, links };
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Graph" subtitle="A living constellation of notes." />
      <Card className="h-[520px] p-0">
        <ForceGraph2D
          graphData={graphData}
          nodeAutoColorBy="id"
          linkColor={() => 'rgba(242,179,255,0.35)'}
          nodeCanvasObject={(node, ctx) => {
            const label = node.name as string;
            ctx.font = '12px Manrope';
            ctx.fillStyle = '#f7f2ff';
            ctx.fillText(label, node.x as number + 8, node.y as number + 4);
          }}
        />
      </Card>
    </div>
  );
}
