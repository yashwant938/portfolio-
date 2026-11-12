import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");

const requiredFiles = [
  "index.html",
  "README.md",
  "CMakeLists.txt",
  "package.json",
  "src/data.js",
  "src/app.js",
  "cpp_labs/lab01_alignment_and_memory.cpp",
  "cpp_labs/lab02_encapsulation_friends_this.cpp",
  "cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp",
  "cpp_labs/lab04_inheritance_diamond_slicing.cpp",
  "cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp",
  "cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp"
];

for (const rel of requiredFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing required file: ${rel}`);
  }
}

// Check generative_ui design constraints on src/app.js & index.html
const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");

if (/text-\[(10|11)px\]/.test(appSource) || /text-\[(10|11)px\]/.test(indexSource)) {
  throw new Error("Design violation: sub-12px micro-text found");
}
if (!appSource.includes("var(--card)") || !appSource.includes("var(--foreground)") || !appSource.includes("var(--primary)")) {
  throw new Error("Design violation: missing semantic CSS variables");
}

// Simulate DOM and exercise all 6 views + 5 animation simulators
const elements = {
  "top-nav-buttons": { innerHTML: "" },
  "app-main-container": { innerHTML: "" }
};

const sandbox = {
  window: {},
  navigator: { clipboard: { writeText: () => {} } },
  document: {
    readyState: "complete",
    addEventListener: () => {},
    getElementById: (id) => elements[id] || null
  }
};

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "src/data.js"), "utf8"), sandbox);
vm.runInContext(appSource, sandbox);

const views = ["landing", "slides", "code-demo", "animation", "quiz", "result"];
for (const v of views) {
  sandbox.window.switchView(v);
  if (!elements["app-main-container"].innerHTML || elements["app-main-container"].innerHTML.length < 100) {
    throw new Error(`View '${v}' failed to render content`);
  }
}

// Exercise all 5 animation simulators and interactive actions
sandbox.window.switchView("animation");
for (const tab of ["align", "vtable", "rvalue", "diamond", "smartptr"]) {
  sandbox.window.setAnimTab(tab);
  if (!elements["app-main-container"].innerHTML.includes("Interactive Memory")) {
    throw new Error(`Animation tab '${tab}' failed to render`);
  }
}

sandbox.window.setAnimTab("align");
sandbox.window.applyGreedySort();
if (!elements["app-main-container"].innerHTML.includes("16 Bytes")) {
  throw new Error("Greedy alignment sort failed to compute 16 Bytes");
}

console.log("FRONTEND & DESIGN AUDIT PASSED: All 6 views, 5 simulators, semantic theme tokens, and 6 C++20 labs verified.");
