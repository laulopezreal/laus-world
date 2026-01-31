import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { vaultIndex } from '../lib/data';
import { useLocation } from 'react-router-dom';
import { useGraphDimensions } from '../hooks/useGraphDimensions';
import { getAllSuggestedLinks, loadSuggestions } from '../lib/suggestions';
import type { SuggestedLink } from '../lib/types';

type GraphMode = 'overview' | 'local' | 'focused' | 'bridge';

interface GraphNode extends NodeObject {
  id: string;
  name: string;
  val: number; // Size multiplier (0.8 - 1.35)
  opacity: number; // Semantic opacity (0.15 - 0.9)
  distance?: number; // Hops from center
}

interface GraphLink extends LinkObject {
  source: string;
  target: string;
}

export function Graph() {
  const location = useLocation();
  const graphRef = useRef<
    ForceGraphMethods<GraphNode, GraphLink> & {
      graph2ScreenCoords?: (x: number, y: number) => { x: number; y: number };
    }
  >();
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  // State
  const [mode, setMode] = useState<GraphMode>('overview');
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showSuggestedLinks, setShowSuggestedLinks] = useState(false);
  const [suggestedLinks, setSuggestedLinks] = useState<SuggestedLink[]>([]);

  // Graph data (Full Universe)
  const fullGraphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const degreeMap = new Map<string, number>();
    const neighborMap = new Map<string, Set<string>>();
    const validSlugs = new Set(vaultIndex.notes.map((n) => n.slug));

    // 1. Generate Links and count degrees (only links whose target is an existing note)
    vaultIndex.notes.forEach((note) => {
      if (!degreeMap.has(note.slug)) degreeMap.set(note.slug, 0);
      if (!neighborMap.has(note.slug)) neighborMap.set(note.slug, new Set());

      note.links.forEach((link) => {
        if (!validSlugs.has(link.target)) return;

        links.push({ source: note.slug, target: link.target });

        degreeMap.set(note.slug, (degreeMap.get(note.slug) || 0) + 1);
        degreeMap.set(link.target, (degreeMap.get(link.target) || 0) + 1);

        if (!neighborMap.has(link.target)) neighborMap.set(link.target, new Set());
        neighborMap.get(note.slug)?.add(link.target);
        neighborMap.get(link.target)?.add(note.slug);
      });
    });

    // 2. Normalize degrees
    let minDegree = Infinity;
    let maxDegree = -Infinity;

    vaultIndex.notes.forEach(note => {
      const degree = degreeMap.get(note.slug) || 0;
      if (degree < minDegree) minDegree = degree;
      if (degree > maxDegree) maxDegree = degree;
    });

    if (minDegree === Infinity) { minDegree = 0; maxDegree = 1; }
    if (minDegree === maxDegree) { maxDegree = minDegree + 1; }

    // 3. Generate Nodes
    vaultIndex.notes.forEach((note) => {
      const degree = degreeMap.get(note.slug) || 0;
      const normalized = (degree - minDegree) / (maxDegree - minDegree);

      nodes.push({
        id: note.slug,
        name: note.title,
        val: 0.8 + (normalized * (1.35 - 0.8)),
        opacity: 0.15 + (normalized * (0.9 - 0.15))
      });
    });

    return { nodes, links, neighborMap, degreeMap, maxDegree };
  }, []);

  // Hub Node (Highest Degree)
  const hubNode = useMemo(() => {
    let max = -1;
    let hub: GraphNode | null = null;
    fullGraphData.nodes.forEach(node => {
      const degree = fullGraphData.degreeMap.get(node.id) || 0;
      if (degree > max) {
        max = degree;
        hub = node;
      }
    });
    return hub;
  }, [fullGraphData]);

  // Visual Data (Ego Network)
  const vizData = useMemo(() => {
    const centerNode = focusedNode || hubNode;
    if (!centerNode) return fullGraphData;

    // BFS to find 2-hop neighborhood
    const visited = new Set<string>();
    const queue: { id: string; dist: number }[] = [{ id: centerNode.id, dist: 0 }];
    const neighborhood = new Set<string>();
    const nodeDistances = new Map<string, number>();

    visited.add(centerNode.id);
    neighborhood.add(centerNode.id);
    nodeDistances.set(centerNode.id, 0);

    let head = 0;
    while (head < queue.length) {
      const { id, dist } = queue[head++];
      if (dist >= 2) continue; // Stop exploring after 2 hops

      const neighbors = fullGraphData.neighborMap.get(id);
      if (neighbors) {
        neighbors.forEach(nid => {
          if (!visited.has(nid)) {
            visited.add(nid);
            neighborhood.add(nid);
            nodeDistances.set(nid, dist + 1);
            queue.push({ id: nid, dist: dist + 1 });
          }
        });
      }
    }

    // Filter nodes
    const nodes = fullGraphData.nodes.filter(n => neighborhood.has(n.id)).map(n => {
      const isCenter = n.id === centerNode.id;
      return {
        ...n,
        // Attach distance for opacity logic
        distance: nodeDistances.get(n.id),
        // Pin visual center to (0,0) to ensure ego-centric stability
        fx: isCenter ? 0 : undefined,
        fy: isCenter ? 0 : undefined
      };
    });

    // Filter links (only internal to neighborhood)
    const links = fullGraphData.links.filter(l =>
      neighborhood.has(l.source as string) && neighborhood.has(l.target as string)
    );

    return { nodes, links, nodeDistances };
  }, [fullGraphData, focusedNode, hubNode]);

  // Camera handling for focus changes
  useEffect(() => {
    if (focusedNode || hubNode) {
      // When focus changes, we wait slightly for data update then center
      // Since we pinned the node to (0,0), we can just centerAt(0,0)
      // But zoomToFit is safer for varying neighborhood sizes
      // We use requestAnimationFrame to ensure it runs after render
      requestAnimationFrame(() => {
        if (graphRef.current) {
          graphRef.current.centerAt(0, 0, 1000);
          graphRef.current.zoom(1.2, 1000);
        }
      });
    }
  }, [focusedNode, hubNode]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let isActive = true;
    if (!showSuggestedLinks) {
      setSuggestedLinks([]);
      return;
    }
    loadSuggestions().then((index) => {
      if (!isActive) return;
      setSuggestedLinks(getAllSuggestedLinks(index));
    });
    return () => {
      isActive = false;
    };
  }, [showSuggestedLinks]);

  // 1. Map for fast node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    fullGraphData.nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [fullGraphData.nodes]);

  // Get neighbors
  const getNeighbors = useCallback((node: GraphNode | null): Set<string> => {
    if (!node) return new Set();
    return fullGraphData.neighborMap.get(node.id) || new Set();
  }, [fullGraphData.neighborMap]);

  // Get 2-hop neighbors
  const getTwoHopNeighbors = useCallback((node: GraphNode | null): Set<string> => {
    if (!node) return new Set();
    const oneHop = getNeighbors(node);
    const twoHop = new Set<string>();
    oneHop.forEach((neighborId) => {
      const neighborNode = nodeMap.get(neighborId);
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
  }, [nodeMap, getNeighbors]);

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
      const node = fullGraphData.nodes.find((n: GraphNode) => n.id === state.noteSlug);
      if (node) {
        setMode('bridge');
        setFocusedNode(node);
        // Center camera on node after a brief delay to let graph initialize
        setTimeout(() => {
          centerOnNode(node, 1.4);
        }, 500);
      }
    } else if (hubNode && !focusedNode) {
      // Default to Hub Node if no state and no focus
      setFocusedNode(hubNode);
    }
    // Note: We don't auto-center here for overview mode anymore, 
    // we let onEngineStop handle the initial center to ensure nodes have settled
  }, [location.state, centerOnNode, fullGraphData.nodes, hubNode]);

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
    if (mode === 'focused' || mode === 'bridge' || focusedNode) {
      setMode('overview');
      setFocusedNode(hubNode); // Reset to Hub
      if (graphRef.current) {
        const duration = prefersReducedMotion ? 0 : 600;
        graphRef.current.zoom(0.7, duration);
      }
    }
  }, [mode, prefersReducedMotion, hubNode, focusedNode]);

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
    // Distance-based fading for Ego Network
    if (node.distance !== undefined) {
      if (node.distance === 0) return 1;
      if (node.distance === 1) return 0.8;
      if (node.distance === 2) return 0.5;
    }

    const activeNode = focusedNode || hoveredNode;

    if (mode === 'overview') {
      // Floor at 0.25 to ensure visibility on dark backgrounds
      return Math.max(0.25, node.opacity || 0.35);
    }

    if (mode === 'local' && hoveredNode) {
      if (node.id === hoveredNode.id) return 1;
      const neighbors = getNeighbors(hoveredNode);
      if (neighbors.has(node.id)) return 0.7;
      return 0.2;
    }

    if ((mode === 'focused' || mode === 'bridge') && focusedNode) {
      if (node.id === focusedNode.id) return 1;
      const oneHop = getNeighbors(focusedNode);
      if (oneHop.has(node.id)) return 0.75;
      const twoHop = getTwoHopNeighbors(focusedNode);
      if (twoHop.has(node.id)) return mode === 'bridge' ? 0.2 : 0.35;
      return mode === 'bridge' ? 0.1 : 0.15;
    }

    return 0.4;
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

    // Keep semantic gravity for non-active nodes in focused/local modes.
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
    const x = node.x ?? 0;
    const y = node.y ?? 0;

    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(242, 179, 255, ${opacity})`;
    ctx.fill();

    // Draw label if needed
    if (shouldShowLabel(node)) {
      const label = node.name;
      const maxLength = zoomLevel >= 1.3 ? 30 : 20;
      const truncated = label.length > maxLength ? label.slice(0, maxLength) + '…' : label;

      ctx.font = '11px Manrope';
      ctx.fillStyle = `rgba(247, 242, 255, ${Math.max(opacity, 0.7)})`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(truncated, x + size + 4, y);
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

  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !showSuggestedLinks) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodeById = new Map(vizData.nodes.map((node) => [node.id, node]));

      ctx.save();
      ctx.strokeStyle = 'rgba(242, 179, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      suggestedLinks.forEach((link) => {
        const source = nodeById.get(link.source);
        const target = nodeById.get(link.target);
        if (!source || !target) return;

        const sourcePos = graphRef.current?.graph2ScreenCoords
          ? graphRef.current.graph2ScreenCoords(source.x || 0, source.y || 0)
          : { x: source.x || 0, y: source.y || 0 };
        const targetPos = graphRef.current?.graph2ScreenCoords
          ? graphRef.current.graph2ScreenCoords(target.x || 0, target.y || 0)
          : { x: target.x || 0, y: target.y || 0 };

        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
      });

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [showSuggestedLinks, suggestedLinks, dimensions.width, dimensions.height]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title="Graph" subtitle="A living constellation of notes." />
        <button
          type="button"
          onClick={() => setShowSuggestedLinks((prev) => !prev)}
          className="mt-1 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted transition duration-300 ease-smooth hover:border-accent hover:text-accent"
        >
          {showSuggestedLinks ? 'Hide suggested links' : 'Show suggested links'}
        </button>
      </div>
      <Card ref={containerRef} className="h-[520px] p-0 overflow-hidden relative">
        {dimensions.width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={vizData}
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
        {showSuggestedLinks && (
          <canvas
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none"
          />
        )}
      </Card>
    </div>
  );
}
