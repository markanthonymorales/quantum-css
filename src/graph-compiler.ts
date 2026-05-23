export interface StyleNode {
  id: string;
  rawClasses: string[];
  count: number;
}

// Memory graph remains stateful
let styleGraph: Record<string, StyleNode> = {};

/**
 * Compiles variants, expanding user-defined macros and polimorphs dynamically
 */
export function compileQuantumClasses(
  inputString: string, 
  macros: Record<string, string> = {}, 
  polimorphs: Record<string, Record<string, string>> = {}
): string {
  if (!inputString) return '';

  let tokens = inputString.split(/\s+/).filter(Boolean);
  let expandedTokens: string[] = [];

  // 1. Loop through tokens to resolve user-defined Macros and Polimorphs
  for (const token of tokens) {
    if (macros[token]) {
      // If it matches a macro shortcut, pull the layout string
      expandedTokens.push(macros[token]);
    } else if (polimorphs[token]) {
      // If it matches a polimorph component mapping, join light and dark modes instantly
      const p = polimorphs[token];
      const lightClasses = p.light || '';
      const darkClasses = p.dark ? p.dark.split(/\s+/).map(c => `dark:${c}`).join(' ') : '';
      expandedTokens.push(`${lightClasses} ${darkClasses}`.trim());
    } else {
      expandedTokens.push(token);
    }
  }

  let processed = expandedTokens.join(' ');

  // 2. Normalize dot notation groups: hover(...).active(...) -> hover(...) active(...)
  processed = processed.replace(/\)\.([a-z0-9:-]+)\(/gi, ') $1(');

  const variantRegex = /([a-z0-9:-]+)\(([^()]+|\((?:[^()]+|\([^()]*\))*\))\)/gi;
  let hasMatches = false;

  processed = processed.replace(/\s+/g, ' ').trim();

  // 3. Recursive nesting processing
  do {
    hasMatches = false;
    processed = processed.replace(variantRegex, (match, variant, innerContent) => {
      hasMatches = true;
      return innerContent
        .split(/\s+/)
        .filter(Boolean)
        .map((t: string) => t.includes('(') || t.includes(')') ? `${variant}:${t}` : `${variant}:${t}`)
        .join(' ');
    });
  } while (hasMatches);

  return processed.replace(/\s+/g, ' ').trim();
}

export function buildStyleGraph(expandedClasses: string): Record<string, StyleNode> {
  const tokens = expandedClasses.split(/\s+/).filter(Boolean);
  const graphKey = tokens.sort().join(' ');

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

export function pruneGraph(): Record<string, StyleNode> {
  const activeGraph: Record<string, StyleNode> = {};
  for (const key in styleGraph) {
    if (styleGraph[key].count > 0) activeGraph[key] = styleGraph[key];
  }
  return activeGraph;
}

export function flattenGraph(prunedGraph: Record<string, StyleNode>): string[] {
  const optimizedBundles: string[] = [];
  for (const key in prunedGraph) {
    const node = prunedGraph[key];
    if (node.count > 1) {
      optimizedBundles.push(`[Cluster ${node.id} x${node.count}]: ${node.rawClasses.join(', ')}`);
    }
  }
  return optimizedBundles;
}