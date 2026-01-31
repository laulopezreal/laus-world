import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { vaultIndex } from '../lib/data';
import { useLocation } from 'react-router-dom';
import { useGraphDimensions } from '../hooks/useGraphDimensions';

type GraphMode = 'overview' | 'local' | 'focused' | 'bridge';

interface GraphNode extends NodeObject {
  id: string;
  name: string;
  val: number; // Size multiplier (0.8 - 1.35)
  opacity: number; // Semantic opacity (0.15 - 0.9)
}

interface GraphLink extends LinkObject {
  source: string;
  target: string;
}

export function Graph() {
  const location = useLocation();
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>();

  // State
  const [mode, setMode] = useState<GraphMode>('overview');
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Graph data
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const degreeMap = new Map<string, number>();
    const neighborMap = new Map<string, Set<string>>();

    // 1. Generate Links and count degrees
    vaultIndex.notes.forEach((note) => {
      // Initialize degree/neighbors for every note
      if (!degreeMap.has(note.slug)) degreeMap.set(note.slug, 0);
      if (!neighborMap.has(note.slug)) neighborMap.set(note.slug, new Set());

      note.links.forEach((link) => {
        links.push({ source: note.slug, target: link.target });

        // Update degrees
        degreeMap.set(note.slug, (degreeMap.get(note.slug) || 0) + 1);
        degreeMap.set(link.target, (degreeMap.get(link.target) || 0) + 1);

        // Update neighbors
        if (!neighborMap.has(link.target)) neighborMap.set(link.target, new Set());
        neighborMap.get(note.slug)?.add(link.target);
        neighborMap.get(link.target)?.add(note.slug);
      });
    });

    // 2. Calculate Min/Max degree for normalization
    let minDegree = Infinity;
    let maxDegree = -Infinity;

    // Only count degrees for nodes that actually exist in our vault
    vaultIndex.notes.forEach(note => {
      const degree = degreeMap.get(note.slug) || 0;
      if (degree < minDegree) minDegree = degree;
      if (degree > maxDegree) maxDegree = degree;
    });

    if (minDegree === Infinity) { minDegree = 0; maxDegree = 1; }
    if (minDegree === maxDegree) { maxDegree = minDegree + 1; }

    // 3. Generate Nodes with visual properties
    vaultIndex.notes.forEach((note) => {
      const degree = degreeMap.get(note.slug) || 0;
      const normalized = (degree - minDegree) / (maxDegree - minDegree);

      nodes.push({
        id: note.slug,
        name: note.title,
        // Map degree to size multiplier (0.8 - 1.35)
        val: 0.8 + (normalized * (1.35 - 0.8)),
        // Map degree to opacity (0.15 - 0.9)
        opacity: 0.15 + (normalized * (0.9 - 0.15))
      });
    });

    return { nodes, links, neighborMap };
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Get neighbors of a node
  const getNeighbors = useCallback((node: GraphNode | null): Set<string> => {
    if (!node) return new Set();
    return graphData.neighborMap.get(node.id) || new Set();
  }, [graphData.neighborMap]);

  // Get 2-hop neighbors
  const getTwoHopNeighbors = useCallback((node: GraphNode | null): Set<string> => {
    if (!node) return new Set();
    const oneHop = getNeighbors(node);
    const twoHop = new Set<string>();
    oneHop.forEach((neighborId) => {
      const neighborNode = graphData.nodes.find((n: GraphNode) => n.id === neighborId);
      if (neighborNode) {
        const secondLevel = getNeighbors(neighborNode);
        secondLevel.forEach((id) => {
          if (id !== node.id && !oneHop.has(id)) {
            twoHop.add(id);
          }
        });
      }
    });
    return twoHop;
  }, [graphData.nodes, getNeighbors]);

  // Center camera on node
  const centerOnNode = useCallback((node: GraphNode, zoom: number) => {
    if (!graphRef.current) return;
    const duration = prefersReducedMotion ? 0 : 800;
    graphRef.current.centerAt(node.x, node.y, duration);
    graphRef.current.zoom(zoom, duration);
  }, [prefersReducedMotion]);

  // Handle Mode 3 (Reading Bridge) - open from note page and initial load
  useEffect(() => {
    const state = location.state as { noteSlug?: string } | null;
    if (state?.noteSlug) {
      const node = graphData.nodes.find((n: GraphNode) => n.id === state.noteSlug);
      if (node) {
        setMode('bridge');
        setFocusedNode(node);
        // Center camera on node after a brief delay to let graph initialize
        setTimeout(() => {
          centerOnNode(node, 1.4);
        }, 500);
      }
    }
    // Note: We don't auto-center here for overview mode anymore, 
    // we let onEngineStop handle the initial center to ensure nodes have settled
  }, [location.state, centerOnNode, graphData.nodes]);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    setMode('focused');
    setFocusedNode(node);
    centerOnNode(node, 1.4);
  }, [centerOnNode]);

  // Handle node hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
    if (node && mode === 'overview' && zoomLevel >= 0.8 && zoomLevel < 1.3) {
      setMode('local');
    } else if (!node && mode === 'local') {
      setMode('overview');
    }
  }, [mode, zoomLevel]);

  // Handle background click
  const handleBackgroundClick = useCallback(() => {
    if (mode === 'focused' || mode === 'bridge') {
      setMode('overview');
      setFocusedNode(null);
      if (graphRef.current) {
        const duration = prefersReducedMotion ? 0 : 600;
        graphRef.current.zoom(0.7, duration);
      }
    }
  }, [mode, prefersReducedMotion]);

  // Handle zoom
  const handleZoom = useCallback((transform: { k: number }) => {
    setZoomLevel(transform.k);

    // Mode transitions based on zoom
    if (transform.k < 0.8 && mode !== 'overview' && mode !== 'focused') {
      setMode('overview');
    }
  }, [mode]);

  // Calculate node opacity based on mode
  const getNodeOpacity = useCallback((node: GraphNode): number => {
    const activeNode = focusedNode || hoveredNode;

    if (mode === 'overview') {
      return node.opacity || 0.35;
    }

    if (mode === 'local' && hoveredNode) {
      if (node.id === hoveredNode.id) return 1;
      const neighbors = getNeighbors(hoveredNode);
      if (neighbors.has(node.id)) return 0.6;
      return 0.15;
    }

    if ((mode === 'focused' || mode === 'bridge') && focusedNode) {
      if (node.id === focusedNode.id) return 1;
      const oneHop = getNeighbors(focusedNode);
      if (oneHop.has(node.id)) return 0.7;
      const twoHop = getTwoHopNeighbors(focusedNode);
      if (twoHop.has(node.id)) return mode === 'bridge' ? 0.15 : 0.25;
      return mode === 'bridge' ? 0.05 : 0.1;
    }

    return 0.35;
  }, [mode, focusedNode, hoveredNode, getNeighbors, getTwoHopNeighbors]);

  // Calculate node size based on mode
  const getNodeSize = useCallback((node: GraphNode): number => {
    const baseSize = 4;
    const activeNode = focusedNode || hoveredNode;

    // Overview: use semantic size
    if (mode === 'overview') return baseSize * (node.val || 1);

    // Active state overrides
    if ((mode === 'local' && node.id === hoveredNode?.id) ||
      ((mode === 'focused' || mode === 'bridge') && node.id === focusedNode?.id)) {
      return baseSize * 1.5; // Ensure active node is larger than max semantic size (1.35)
    }

    // Neighbors in active modes
    // Should we respect their semantic size or normalize them?
    // "No changes to label rules or interaction logic"
    // Usually neighbors are just baseSize.
    // But if a neighbor is a semantic giant, shrinking it to baseSize might be weird.
    // Let's keep them at semantic size unless they are the active one?
    // "Graph remains calm" -> Let's keep adjacent nodes at semantic size?
    // Re-reading: "Mode 1/2... focused node still overrides..."
    // Just return baseSize for non-active nodes in focused mode?
    // If I return `baseSize`, they lose their gravity.
    // Let's return `baseSize * node.val` for everything that isn't the focused node itself.
    // This keeps the "gravity" context even when focusing on a specific node.
    return baseSize * (node.val || 1);
  }, [mode, focusedNode, hoveredNode]);

  // Determine if label should be shown
  const shouldShowLabel = useCallback((node: GraphNode): boolean => {
    if (zoomLevel < 0.8) return false;

    const activeNode = focusedNode || hoveredNode;

    if (mode === 'local' && hoveredNode) {
      return node.id === hoveredNode.id;
    }

    if ((mode === 'focused' || mode === 'bridge') && focusedNode) {
      if (node.id === focusedNode.id) return true;
      if (zoomLevel >= 1.3) {
        const neighbors = getNeighbors(focusedNode);
        return neighbors.has(node.id);
      }
    }

    return false;
  }, [mode, zoomLevel, focusedNode, hoveredNode, getNeighbors]);

  // Custom node rendering
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D) => {
    const opacity = getNodeOpacity(node);
    const size = getNodeSize(node);

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(242, 179, 255, ${opacity})`;
    ctx.fill();

    // Draw label if needed
    if (shouldShowLabel(node)) {
      const label = node.name;
      const maxLength = zoomLevel >= 1.3 ? 30 : 20;
      const truncated = label.length > maxLength ? label.slice(0, maxLength) + '…' : label;

      ctx.font = '11px Manrope';
      ctx.fillStyle = `rgba(247, 242, 255, ${Math.min(opacity, 0.7)})`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(truncated, node.x! + size + 4, node.y!);
    }
  }, [getNodeOpacity, getNodeSize, shouldShowLabel, zoomLevel]);

  // Determine if link should be visible
  const isLinkVisible = useCallback((link: GraphLink): boolean => {
    if (mode === 'overview') return true;

    const activeNode = focusedNode || hoveredNode;
    if (!activeNode) return true;

    return link.source === activeNode.id || link.target === activeNode.id;
  }, [mode, focusedNode, hoveredNode]);

  // Get link opacity
  const getLinkOpacity = useCallback((link: GraphLink): number => {
    if (mode === 'overview') return 0.1;

    if (!isLinkVisible(link)) return 0;

    if (mode === 'local') return 0.25;
    if (mode === 'focused' || mode === 'bridge') return 0.3;

    return 0.1;
  }, [mode, isLinkVisible]);

  // Container resizing
  const { containerRef, dimensions } = useGraphDimensions();

  useEffect(() => {
    // Re-center when dimensions change
    if (graphRef.current && dimensions.width > 0 && dimensions.height > 0) {
      requestAnimationFrame(() => {
        graphRef.current?.zoomToFit(400, 50);
      });
    }
  }, [dimensions]);

  return (
    <div className="space-y-8">
      <SectionHeader title="Graph" subtitle="A living constellation of notes." />
      <Card ref={containerRef} className="h-[520px] p-0 overflow-hidden relative">
        {dimensions.width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeRelSize={4}
            nodeCanvasObject={nodeCanvasObject}
            nodeCanvasObjectMode={() => 'replace'}
            linkColor={(link: LinkObject) => {
              const opacity = getLinkOpacity(link as GraphLink);
              return `rgba(242, 179, 255, ${opacity})`;
            }}
            linkWidth={1}
            linkCurvature={0.1}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onBackgroundClick={handleBackgroundClick}
            onZoom={handleZoom}
            enableNodeDrag={false}
            cooldownTicks={100}
            d3VelocityDecay={0.3}
            onEngineStop={() => {
              if (mode === 'overview' && !location.state) {
                graphRef.current?.zoomToFit(400, 50);
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
