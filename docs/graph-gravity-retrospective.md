# Development Retrospective: Graph Gravity & Ego-Network Implementation

This document provides a detailed account of the implementation process for
the Graph Gravity and Ego-centric Layout features in laus-world.

## 1. Initial Objective

The goal was to transform the graph from a dense, overwhelming "global" view
into a structured, semantically meaningful representation.

Key requirements included:

- Ego-centric Layout: Focus on a single node (the "Focused Node" or the
  highest-degree "Hub Node") and show only its 2-hop neighborhood.
- Semantic Gravity: Map node connectivity (degree) to visual properties
  (size and opacity).
- Visual Stability: Ensure the graph doesn't "jitter" or reorganize
  chaotically when the focus changes.
- Calm Interaction: Fade out peripheral nodes to maintain focus on the
  immediate context.

## 2. Technical Implementation Details

### A. Data Architecture (The Ego Network)

Instead of rendering the entire fullGraphData, we implemented a vizData
selector using a Breadth-First Search (BFS) algorithm:

- Filtering: Captures the central node and its 1-step and 2-step neighbors.
- Distance Meta-data: Each node in vizData is assigned a distance property
  (0, 1, or 2), which is used for the fading logic.
- Performance Optimization: Introduced a nodeMap (ID -> Node) to replace
  expensive .find() operations during neighborhood lookups, significantly
  improving rendering performance in large datasets.

### B. Visual Stabilization (Coordinate Pinning)

One of the key technical challenges was preventing the graph from "flying
away" or recalculating positions from scratch on every change.

- Fixed Center: The active focus node is pinned using fx=0, fy=0.
- Camera Coupling: A useEffect hook monitors focus changes and automatically
  runs graphRef.current.centerAt(0, 0) and zoom(1.2). This ensures the "Local
  Universe" is always perfectly framed.

### C. Visual Encodings (Gravity & Fading)

We applied strict mapping rules to enforce semantic importance:

- Size: Scaled between 0.8x and 1.35x based on degree (connectivity).
- Opacity:
  - Overview: Weighted by degree, floored at 0.25 for visibility.
  - Focused/Ego: Distance-based fading (1.0 for center, 0.8 for 1-hop, 0.5
    for 2-hop).
  - Interactive (Hover): Neighbors of a hovered node are brightened, while
    others are dimmed to 0.2.

## 3. Challenges & Perspective Shifts

### The "Stuck" Point: Invisible Nodes

During early verification, the graph appeared to be "gone" or "black."
We investigated several failure modes:

- Empty vizData: BFS was failing because properties like source and target
  in the links were being manipulated by react-force-graph's internal engine
  (converting IDs to objects).
- Opacity Thresholds: The initial opacity floor was too low (0.15), making
  nodes almost invisible against the dark theme.
- Coordinate Desync: Because vizData creates a sub-slice of nodes, the engine
  sometimes lost track of previous positions.

### The Solution: Stable Mapping

We shifted from a "Filtered View" (where nodes disappear and reappear) to a
"Pinned Coordinate Universe":

- By pinning the center to (0,0), we created a consistent anchor.
- We increased the opacity floor and ensured that even during the "engine
  cooling" phase, nodes are rendered at a minimum visibility to avoid the
  "black screen" effect.

## 4. Workflow & Automation

In addition to the code changes, we updated project workflows based on
feedback:

- `postPR.md`: Added a mandatory check for CI/CD status to catch build
  failures early in the review cycle.
- Task Focus: Decoupled "Agent Research" from the graph implementation to
  ensure 100% bandwidth was dedicated to the core visualization stable.

## 5. Verification Results

- Ego-Focus: Clicking a node successfully transitions the graph to its
  neighborhood.
- Hub Return: Clicking the background correctly restores the "Universe Hub"
  (the node with the most connections).
- Visibility: Nodes are now clearly rendered with a soft glowing aesthetic,
  matching the laus-world design system.

## Changes in this PR

- [MODIFY] `src/pages/Graph.tsx` (Logic, Performance, Rendering)
- [MODIFY] `.agent/workflows/postPR.md` (Workflow update)
