import { Plugin } from 'vite';
import { compileQuantumCSS } from './graph-compiler';

// Define the configuration options for the plugin
export interface QuantumCSSOptions {
  debug?: boolean;
}

export function vitePluginQuantumCSS(options: QuantumCSSOptions = {}): Plugin {
  const isDebug = options.debug === true;

  return {
    name: 'vite-plugin-quantum-css',
    enforce: 'pre',

    transform(code, id) {
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) return null;

      const qClassRegex = /qClass=(?:{([^]+)`}|"([^"]+)"|'([^']+)')/g;
      let fileLoggedHeader = false;

      const transformedCode = code.replace(qClassRegex, (match, templateStr, doubleQuoteStr, singleQuoteStr) => {
        const rawContent = templateStr || doubleQuoteStr || singleQuoteStr;
        if (!rawContent) return match;

        const expanded = compileQuantumCSS(rawContent, code);

        // Debug Log output terminal metrics
        if (isDebug) {
          if (!fileLoggedHeader) {
            console.log(`\n\x1b[35m[Quantum CSS] Analyzing: ${id.split('/').pop()}\x1b[0m`);
            fileLoggedHeader = true;
          }
          console.log(`  \x1b[31m[-] qClass:\x1b[0m "${rawContent}"`);
          console.log(`  \x1b[32m[+] class:\x1b[0m  "${expanded}"\n`);
        }
        
        return `className="${expanded}"`;
      });

      return { code: transformedCode, map: null };
    },
  };
}
