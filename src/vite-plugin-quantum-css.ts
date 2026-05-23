import { Plugin } from 'vite';
import { compileQuantumCSS } from './graph-compiler';

export function vitePluginQuantumCSS(): Plugin {
  return {
    name: 'vite-plugin-quantum-css',
    enforce: 'pre',

    transform(code, id) {
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) return null;

      const qClassRegex = /qClass=(?:{([^]+)`}|"([^"]+)"|'([^']+)')/g;

      const transformedCode = code.replace(qClassRegex, (match, templateStr, doubleQuoteStr, singleQuoteStr) => {
        const rawContent = templateStr || doubleQuoteStr || singleQuoteStr;
        if (!rawContent) return match;

        const expanded = compileQuantumCSS(rawContent, code);
        return `className="${expanded}"`;
      });

      return { code: transformedCode, map: null };
    },
  };
}
