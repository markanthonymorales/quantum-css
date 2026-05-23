🌌 Quantum CSS

Quantum CSS is a Vite plugin + Tailwind extension that lets you write clean, nested qClass attributes.  
It compiles them into standard Tailwind classes using a Graph-Based Style Tree Compiler with advanced features like:

- ⚡ Dynamic Utility Polimorphs  
- 🌀 Compounded Variant Groups  
- 📐 Layout Macros  
- 🌳 Graph-Based Style Tree Elimination  

---

🚀 Installation

`bash
npm install quantum-css
`

---

⚙️ Setup

Vite Config
Add the plugin to your vite.config.ts:

`ts
import { defineConfig } from 'vite';
import { vitePluginQuantumCSS } from 'quantum-css';

export default defineConfig({
  plugins: [vitePluginQuantumCSS()],
});
`

Tailwind Config
Tell Tailwind to scan for qClass attributes:

`js
// tailwind.config.js
module.exports = {
  content: [
    './src//*.{js,ts,jsx,tsx,vue,svelte,blade.php}',
    { raw: 'qClass' }
  ],
};
`

---

🧩 Usage Examples

React / Solid / Preact
`tsx
<div qClass="layout-dashboard interactive-primary bg-polimorph">
  <h1 qClass="hover(text-white shadow-lg) dark(bg-zinc-900)">
    Quantum CSS
  </h1>
</div>
`

---

Vue
`vue
<template>
  <button qClass="hover(bg-blue-500 text-white) active(scale-95)">
    Click Me
  </button>
</template>
`

Compiles to:
`vue
<button class="hover:bg-blue-500 hover:text-white active:scale-95">
  Click Me
</button>
`

---

Blade (Laravel)
`blade
<div qClass="layout-dashboard bg-polimorph">
  <button qClass="hover(bg-blue-500 text-white)">
    {{ ('Click Me') }}
  </button>
</div>
`

Compiles to:
`blade
<div class="grid grid-cols-[250px_1fr] gap-4 bg-white dark:bg-gradient-to-r">
  <button class="hover:bg-blue-500 hover:text-white">
    Click Me
  </button>
</div>
`

---

Svelte
`svelte
<script>
  let label = "Click Me";
</script>

<button qClass="hover(bg-green-500 text-white)">
  {label}
</button>
`

Compiles to:
`svelte
<button class="hover:bg-green-500 hover:text-white">
  Click Me
</button>
`

---

Astro
`astro
---
const title = "Quantum CSS";
---

<div qClass="layout-dashboard bg-polimorph">
  <h1>{title}</h1>
</div>
`

---

🔮 Features

- Dynamic Utility Polimorphs  
- Compounded Variant Groups  
- Layout Macros  
- Graph-Based Style Tree Compiler  

---

🛠 Editor Integration (VS Code)

Enable IntelliSense for qClass:

`json
{
  "tailwindCSS.experimental.classRegex": [
    ["qClass=\"([^\"])\"", "([^ ])"],
    ["qClass={([^])}`", "([^ ])"]
  ]
}
`

---

🧠 How It Works

1. Parse qClass → Regex expands nested syntax into a tree.  
2. Build Graph → Each variant/utility becomes a node.  
3. Context Resolution → Polimorphs adapt to light/dark/modal.  
4. Graph Traversal → Only referenced branches are marked used.  
5. Pruning → Dead branches are eliminated.  
6. Emit Classes → Flattened into Tailwind‑compatible strings.

---

📜 License

MIT © Quantum CSS Contributors
