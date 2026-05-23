// Define your Custom Structural UI Shortcuts here
const QUANTUM_MACROS: Record<string, string> = {
  'layout-dashboard': 'grid grid-cols-1 md:grid-cols-12 gap-6 min-h-screen w-full',
  'bg-polimorph': 'bg-gradient-to-br from-slate-50 via-white to-zinc-100 dark:from-zinc-950 dark:to-neutral-900',
  'interactive-primary': 'transition-all duration-200 transform ease-in-out cursor-pointer active:scale-98 select-none'
};

export interface StyleNode {
  id: string;
  rawClasses: string[];
  count: number;
}

// Stateful internal memory graph tree 
let styleGraph: Record<string, StyleNode> = {};

/**
 * 1. Step: Compiles shorthand variant syntax into pure Tailwind utilities
 */
export function compileQuantumClasses(inputString: string): string {
  if (!inputString) return '';

  // Expand standard shortcuts/macros if they match keys exactly
  let processed = inputString
    .split(/\s+/)
    .map(token => QUANTUM_MACROS[token] || token)
    .join(' ');

  // Normalize chained dot notation groups: hover(...).active(...) -> hover(...) active(...)
  processed = processed.replace(/\)\.([a-z0-9:-]+)\(/gi, ') $1(');

  const variantRegex = /([a-z0-9:-]+)\(([^()]+|\((?:[^()]+|\([^()]*\))*\))\)/gi;
  let hasMatches = false;

  processed = processed.replace(/\s+/g, ' ').trim();

  // Recursively unwrap inner layers outwards
  do {
    hasMatches = false;
    processed = processed.replace(variantRegex, (match, variant, innerContent) => {
      hasMatches = true;
      return innerContent
        .split(/\s+/)
        .filter(Boolean)
        .map((token: string) => token.includes('(') || token.includes(')') ? `${variant}:${token}` : `${variant}:${token}`)
        .join(' ');
    });
  } while (hasMatches);

  return processed.replace(/\s+/g, ' ').trim();
}

/**
 * 2. Step: Feeds single-string file style chunks into the master layout graph
 */
export function buildStyleGraph(expandedClasses: string): Record<string, StyleNode> {
  const tokens = expandedClasses.split(/\s+/).filter(Boolean);
  const graphKey = tokens.sort().join(' '); // Group exact matching string footprints

  if (!graphKey) return styleGraph;

  if (!styleGraph[graphKey]) {
    styleGraph[graphKey] = {
      id: `node_${Math.random().toString(36).substr(2, 9)}`,
      rawClasses: tokens,
      count: 0
    };
  }
  
  styleGraph[graphKey].count += 1;
  return styleGraph;
}

/**
 * 3. Step: Prunes unused leaf references or fragments out of the system
 */
export function pruneGraph(): Record<string, StyleNode> {
  const activeGraph: Record<string, StyleNode> = {};
  
  for (const key in styleGraph) {
    if (styleGraph[key].count > 0) {
      activeGraph[key] = styleGraph[key];
    }
  }
  
  return activeGraph;
}

/**
 * 4. Step: Flattens and compresses highly repeated patterns to optimize output
 */
export function flattenGraph(prunedGraph: Record<string, StyleNode>): string[] {
  const optimizedBundles: string[] = [];
  
  for (const key in prunedGraph) {
    const node = prunedGraph[key];
    // If a specific design block composition is used heavily, group it
    if (node.count > 1) {
      optimizedBundles.push(`[Shared Cluster ${node.id} x${node.count}]: ${node.rawClasses.join(', ')}`);
    }
  }
  
  return optimizedBundles;
}