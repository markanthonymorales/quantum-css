import { Plugin } from 'vite';
import { 
  compileQuantumClasses, 
  buildStyleGraph, 
  pruneGraph, 
  flattenGraph 
} from './graph-compiler';

// Define configuration shape allowing macros and polimorph entries
export interface QuantumCSSOptions {
  debug?: boolean;
  macros?: Record<string, string>;
  polimorphs?: Record<string, Record<string, string>>;
}

export function vitePluginQuantumCSS(options: QuantumCSSOptions = {}): Plugin {
  const isDebug = options.debug === true;
  const userMacros = options.macros || {};
  const userPolimorphs = options.polimorphs || {};

  return {
    name: 'vite-plugin-quantum-css',
    enforce: 'pre', 

    transform(code: string, id: string) {
      if (!/\.(vue|js|ts|jsx|tsx|svelte|astro)$/.test(id)) return null;

      const qClassRegex = /qClass=(?:{`([^`]+)`}|"([^"]+)"|'([^']+)')/g;
      let fileLoggedHeader = false;

      const transformed = code.replace(qClassRegex, (match, templateStr, doubleQuoteStr, singleQuoteStr) => {
        const rawContent = templateStr || doubleQuoteStr || singleQuoteStr;
        if (!rawContent) return match;

        // Pass user definitions straight through the compiler process call
        const expanded = compileQuantumClasses(rawContent, userMacros, userPolimorphs);

        buildStyleGraph(expanded);

        if (isDebug) {
          if (!fileLoggedHeader) {
            console.log(`\n\x1b[35m[Quantum CSS] Custom Rules Running: ${id.split('/').pop()}\x1b[0m`);
            fileLoggedHeader = true;
          }
          console.log(`  \x1b[31m[-] qClass:\x1b[0m "${rawContent}"`);
          console.log(`  \x1b[32m[+] class:\x1b[0m  "${expanded}"\n`);
        }

        return `class="${expanded}"`;
      });

      return { code: transformed, map: null };
    },

    generateBundle() {
      if (isDebug) {
        console.log('\x1b[36m[Quantum CSS] Running Graph Optimizer optimization...\x1b[0m');
      }

      const cleanGraph = pruneGraph();
      const optimizations = flattenGraph(cleanGraph);

      if (isDebug && optimizations.length > 0) {
        console.log('\x1b[34m[Quantum CSS] Shared Component Repetitions Found:\x1b[0m');
        optimizations.forEach(opt => console.log(`  ⚡ ${opt}`));
      }
    }
  };
}

export default vitePluginQuantumCSS;