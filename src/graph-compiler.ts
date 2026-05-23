// Graph-Based Style Tree Compiler for Quantum CSS

export class StyleNode {
  id: string;
  children: StyleNode[];
  context: string | null;
  used: boolean;

  constructor(id: string, context: string | null = null) {
    this.id = id;
    this.children = [];
    this.context = context;
    this.used = false;
  }
}

function tokenizeQuantumSyntax(qClassString: string): any[] {
  // Simplified tokenizer: split by spaces, detect variant groups
  const tokens: any[] = [];
  qClassString.split(/\s+/).forEach(token => {
    const match = token.match(/^([a-z0-9:-]+)\((.+)\)$/i);
    if (match) {
      tokens.push({ variant: match[1], children: match[2].split(' ') });
    } else {
      tokens.push(token);
    }
  });
  return tokens;
}

export function buildStyleGraph(qClassString: string): StyleNode[] {
  const tokens = tokenizeQuantumSyntax(qClassString);
  const rootNodes: StyleNode[] = [];

  tokens.forEach(token => {
    if (typeof token === 'object') {
      const parent = new StyleNode(token.variant);
      token.children.forEach((child: string) => {
        parent.children.push(new StyleNode(`${token.variant}:${child}`));
      });
      rootNodes.push(parent);
    } else {
      rootNodes.push(new StyleNode(token));
    }
  });

  return rootNodes;
}

export function markUsedNodes(graph: StyleNode[], jsxCode: string) {
  graph.forEach(node => {
    if (jsxCode.includes(node.id)) {
      node.used = true;
      node.children.forEach(child => child.used = true);
    }
  });
}

export function pruneGraph(graph: StyleNode[]): StyleNode[] {
  return graph.filter(node => node.used).map(node => {
    node.children = pruneGraph(node.children);
    return node;
  });
}

export function flattenGraph(graph: StyleNode[]): string {
  return graph.map(node => {
    if (node.children.length > 0) {
      return flattenGraph(node.children);
    }
    return node.id;
  }).join(' ');
}

export function compileQuantumCSS(qClassString: string, jsxCode: string): string {
  const graph = buildStyleGraph(qClassString);
  markUsedNodes(graph, jsxCode);
  const pruned = pruneGraph(graph);
  return flattenGraph(pruned);
}
