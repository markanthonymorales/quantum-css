# Vite Plugin Quantum CSS

> A next-generation, utility-first compiler plugin for Vite that brings nested variant scoping, custom structural macros, and adaptive polimorphic states to Tailwind CSS without leaving your HTML markup.

---

## 🚀 Key Features

* **Nested Variant Scoping:** Say goodbye to repetitive chains like `hover:bg-blue-500 hover:text-white dark:hover:bg-zinc-900`. Group them cleanly: `hover(bg-blue-500 text-white dark(bg-zinc-900))`.
* **Chained Variant Notation:** Supports dot-chained interaction matrices natively out of the box (e.g., `hover(bg-blue-500).active(scale-95)`).
* **Custom Layout Macros:** Keep your HTML abstract and clean by mapping complex structural utility groupings directly to reusable design keys at the build layer.
* **Adaptive Polimorphs:** Create state-aware tokens that bundle complex dark/light transitions into singular element definitions dynamically.
* **Graph-Based Tree Elimination:** Analyzes structural class layouts globally during the bundle step to map and optimize duplicated cluster footprints.

---

## 📦 Installation

Install the plugin directly into your web application framework from the npm registry:

```bash
npm install vite-plugin-quantum-css --save-dev

```

---

## 🛠️ Configuration Setup

### 1. Configure Vite (`vite.config.ts`)

Import the plugin into your main configuration bundle using the exact module name:

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // Or @vitejs/plugin-react
import { vitePluginQuantumCSS } from 'vite-plugin-quantum-css';

export default defineConfig({
  plugins: [
    vitePluginQuantumCSS({
      debug: true, // Set to true to view live terminal compilation diffs
      macros: {
        'layout-dashboard': 'grid grid-cols-[250px_1fr] gap-4 min-h-screen w-full',
        'interactive-primary': 'transition-all duration-200 cursor-pointer active:scale-98 select-none'
      },
      polimorphs: {
        'bg-polimorph': {
          light: 'bg-white/80 backdrop-blur-sm',
          dark: 'bg-gray-900/80 backdrop-blur-sm'
        }
      }
    }),
    vue()
  ]
});

```

### 2. Configure Tailwind CSS (`tailwind.config.js`)

Because you write `qClass="..."` in your raw source code components, you must instruct Tailwind's string parser to explicitly inspect your component directory tree so it generates the resulting styles safely:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,svelte,astro}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

---

## 💡 Usage Examples

Now you can write highly expressive utility templates across Vue, React, Solid, or Svelte components using the `qClass` attribute:

```html
<template>
  <div qClass="layout-dashboard bg-polimorph p-6">
    
    <p qClass="text-slate-500 hover(text-blue-600 font-bold dark(text-zinc-200 scale-105))">
      Hover me to see deep variant scoping trigger!
    </p>

    <button qClass="p-4 interactive-primary hover(bg-blue-600 text-white).active(scale-95)">
      Interactive Action Core
    </button>
    
  </div>
</template>

```

---

## 💻 Visual Terminal Debugging

When `debug: true` is initialized inside your project options, the compiler pipeline tracks code leaves on every file save and streams immediate readouts into your local terminal environment:

```text
[Quantum CSS] Analyzing: App.vue
  [-] qClass: "layout-dashboard bg-polimorph"
  [+] class:  "grid grid-cols-[250px_1fr] gap-4 min-h-screen w-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:backdrop-blur-sm"

  [-] qClass: "hover(bg-blue-500 text-white).active(scale-95)"
  [+] class:  "hover:bg-blue-500 hover:text-white active:scale-95"

[Quantum CSS] Initiating Style Tree Graph Elimination...
[Quantum CSS] Shared Component Repetitions Found:
  ⚡ [Cluster node_a8f1b2 x3]: grid, grid-cols-[250px_1fr], gap-4...
[Quantum CSS] Global tree graph optimization complete!

```

---

## 📝 Editor Autocomplete Setup (VS Code)

To get perfect utility string autocompletions inside your custom `qClass` attribute, add the following configuration rule block inside your local project `.vscode/settings.json` file:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["qClass=\"([^\"]*)\"", "([^ ]*)"],
    ["qClass={\`([^\`]*)\`}", "([^ ]*)"]
  ]
}

```

---

## 📄 License

MIT License. Open source and free to extend!