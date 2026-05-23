import { Plugin } from 'vite';
import { 
  compileQuantumClasses, 
  buildStyleGraph, 
  pruneGraph, 
  flattenGraph 
} from './graph-compiler';

export interface QuantumCSSOptions {
  debug?: boolean;
}

export function vitePluginQuantumCSS(options: QuantumCSSOptions = {}): Plugin {
  // Debug flags run automatically if you run production builds
  const isDebug = options.debug === true; 

  return {
    name: 'vite-plugin-quantum-css',
    enforce: 'pre', 

    // Lifecycle Phase 1: File Transformation & Leaf Assembly Identification
    transform(code: string, id: string) {
      // Processes all core UI framework markup profiles
      if (!/\.(vue|js|ts|jsx|tsx|svelte|astro)$/.test(id)) return null;

      const qClassRegex = /qClass=(?:{`([^`]+)`}|"([^"]+)"|'([^']+)')/g;
      let fileLoggedHeader = false;

      const transformed = code.replace(qClassRegex, (match, templateStr, doubleQuoteStr, singleQuoteStr) => {
        const rawContent = templateStr || doubleQuoteStr || singleQuoteStr;
        if (!rawContent) return match;

        // Unwrap composite variants
        const expanded = compileQuantumClasses(rawContent);

        // Feed string directly into single-parameter graph system
        buildStyleGraph(expanded);

        if (isDebug) {
          if (!fileLoggedHeader) {
            console.log(`\n\x1b[35m[Quantum CSS] Analyzing: ${id.split('/').pop()}\x1b[0m`);
            fileLoggedHeader = true;
          }
          console.log(`  \x1b[31m[-] qClass:\x1b[0m "${rawContent}"`);
          console.log(`  \x1b[32m[+] class:\x1b[0m  "${expanded}"\n`);
        }

        return `class="${expanded}"`;
      });

      return { code: transformed, map: null };
    },

    // Lifecycle Phase 2: Structural Compand Optimization Delivery
    generateBundle() {
      if (isDebug) {
        console.log('\x1b[36m[Quantum CSS] Initiating Style Tree Graph Elimination...\x1b[0m');
      }

      const cleanGraph = pruneGraph();
      const optimizations = flattenGraph(cleanGraph);

      if (isDebug && optimizations.length > 0) {
        console.log('\x1b[34m[Quantum CSS] Found Duplicated Compounded Structural Node Clusters:\x1b[0m');
        optimizations.forEach(opt => console.log(`  ⚡ ${opt}`));
      }

      if (isDebug) {
        console.log('\x1b[32m[Quantum CSS] Global tree graph optimization complete!\x1b[0m\n');
      }
    }
  };
}

export default vitePluginQuantumCSS;