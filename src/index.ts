export { vitePluginQuantumCSS } from './vite-plugin-quantum-css';
export type { QuantumCSSOptions } from './vite-plugin-quantum-css';
export { 
  compileQuantumClasses, 
  buildStyleGraph, 
  pruneGraph, 
  flattenGraph,
  StyleNode 
} from './graph-compiler';

// Default export alignment for straightforward import strategies
import { vitePluginQuantumCSS } from './vite-plugin-quantum-css';
export default vitePluginQuantumCSS;