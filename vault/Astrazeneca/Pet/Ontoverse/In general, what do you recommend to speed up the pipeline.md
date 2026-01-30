Below are the **biggest wins we’ve seen when teams build “graph + D3 + React” UIs like yours.**  
I’ve grouped them from **“fastest to wire-up” → “larger refactors.”** Pick the ones that fit your schedule.

||Recommendation|Why it helps|How to do it quickly|
|---|---|---|---|

|**1**|**Memoize expensive selectors** – especially the ones that flatten `paperNodes`, build `cloneNodes`, and run `getFiltered / getSortedPapers`.|Zustand’s store updates on _every dispatch_; without `shallow` or `memo`, derived arrays are rebuilt and trigger re-renders.|`ts const allPapers = useRichDataStore(state => state.paperNodes, shallow)` and wrap heavy calculations in `useMemo` **and** `useDeferredValue` (React 18).|

|**2**|**De-bounce D3 zoom > URL writing**|You already debounce to 500 ms, but still run on **mousemove** (fires every frame). Check `event.sourceEvent?.type === 'zoom'` _instead_ of `mousemove`.||

|**3**|**Strip all `console.log` & dev-only imports in prod**|Logs + source-map parsing cost ~30–70 ms per mount.|Vite: `build.rollupOptions.treeshake = { annotations: true }` + `vite-plugin-strip`.|
|**4**|**Pre-compute graph layout & contours offline**|Contour calculation is your top stack-trace. Do it once (in Node.js or a small cloud function) → save JSON.|CLI script: `node scripts/buildLayout.js`. Load the JSON straight into the client.|
|**5**|**Move heavy crunching (contours, large filters) to a Web Worker**|Main thread stays free, React feels snappy even on 1 MB graphs.|`comlink` + `vite-plugin-worker` – expose `buildContours(points)` from the worker, return GeoJSON paths.|
|**6**|**Virtualise the graph itself** (canvas layers)|SVG hurts when ≥2 k nodes. A static `<canvas>` for edges + highlighted `<svg>` layer for selected nodes gives a 5-10× boost.|Keep existing D3 code, but switch `selection.select('canvas')` for the edge links; only selected / hovered nodes remain in SVG.|
|**7**|**Code-split right-drawer & filter panel**|They’re tree-shaken but still inside the first JS chunk.|`const FilterPanel = lazy(() => import('./FilterPanel'))` + `<Suspense>`.|
|**8**|**Use `React.Profiler` + the DevTools flame-graph**|Find the slowest commit phases; you’ll usually see `PaperItem` or `TopicChip` rerendering too often.|Wrap suspected components in `<Profiler id="PaperItem" onRender={…} />`.|
|**9**|**Incremental TypeScript build in CI**|`tsc --build` with project references cuts 40-70 % from a cold build.||
|**10**|**Turn on the Vite esbuild pre-bundle cache**|`optimizeDeps.persist = true` (default), but make sure the cache folder isn’t nuked by Docker layers.||

---

### Quick illustration of the _single_ biggest hot-path right now

```txt
renderContoursByDensity ⟶ contourDensity()       ←  ~250 ms
                          ⟶ geoPath()            ←  ~120 ms
Graph re-init on zoom     ⟶ initGraph()          ←  ~220 ms
```

If you _pre-compute_ the contour paths and ship them as SVG `<path>` strings, the browser just paints them → ~10 ms instead of ~400 ms.

---

### Low-hanging micro-optimisations

- **`findCloneNodes`** – return early if `cloneNodes.length === 0`.
    
- **`getCirclesBoundingBox`** – cache result per topic cluster key.
    
- **`Virtuoso` height** – instead of recalculating every render, memoise with `useMemo([filteredAndSortedPapers.length])`.
    

---

**Start with 1–4; you’ll feel the UI snap immediately.**  
When you have a full sprint, tackle 5–6 for long-term scalability. Good luck, and ping me when you need deeper profiling!