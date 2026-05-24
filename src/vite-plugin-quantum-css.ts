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
      if (!/\.(html|vue|js|ts|jsx|tsx|svelte|astro)$/.test(id)) return null;

      const qClassRegex = /(?:qClass=\s*(?:{`([^`]+)`}|"([^"]+)"|'([^']+)'|([^>\s]+)))|(?:name:\s*['"]qClass['"]\s*,\s*value:\s*[`'"]([^`'"]+)[`'"])|(?:createElement\([^,]+,\s*[^,]+,\s*[`'"]([^`'"]+)[`'"])/g;

      let fileLoggedHeader = false;

      const transformed = code.replace(qClassRegex, (...args) => {
        const match = args[0];
    
        const rawContent = args[1] || args[2] || args[3] || args[4] || args[5] || args[6];
        if (!rawContent) return match;

        const isJavaScriptObject = match.includes('name:');
        const isMethodCall = match.includes('createElement');

        // Pass user definitions straight through the compiler process call
        const expanded = compileQuantumClasses(rawContent, userMacros, userPolimorphs);
        buildStyleGraph(expanded);

        if (isDebug) {
          if (!fileLoggedHeader) {
            console.log(`\n\x1b[35m[Vite Plugin Quantum CSS] Custom Rules Running: ${id.split('/').pop()}\x1b[0m`);
            fileLoggedHeader = true;
          }
          console.log(`  \x1b[31m[-] qClass:\x1b[0m "${rawContent}"`);
          console.log(`  \x1b[32m[+] class:\x1b[0m  "${expanded}"\n`);
        }

        // Return the appropriate format based on how the code was written
        if (isJavaScriptObject) {
          return match.replace('qClass', 'class').replace(rawContent, expanded);
        } else if (isMethodCall) {
          // Keeps the OOP syntax intact but replaces the inner string parameter with the expanded utilities
          return match.replace(rawContent, expanded);
        } else {
          return `class="${expanded}"`;
        }
      });

      return { code: transformed, map: null };
    },

    generateBundle() {
      if (isDebug) {
        console.log('\x1b[36m[Vite Plugin Quantum CSS] Running Graph Optimizer optimization...\x1b[0m');
      }

      const cleanGraph = pruneGraph();
      const optimizations = flattenGraph(cleanGraph);

      if (isDebug && optimizations.length > 0) {
        console.log('\x1b[34m[Vite Plugin Quantum CSS] Shared Component Repetitions Found:\x1b[0m');
        optimizations.forEach(opt => console.log(`  ⚡ ${opt}`));
      }
    }
  };
}

export default vitePluginQuantumCSS;