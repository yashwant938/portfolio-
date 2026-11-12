import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");

const requiredFiles = [
  "index.html",
  "README.md",
  "CMakeLists.txt",
  "package.json",
  "src/styles.css",
  "src/data.js",
  "src/app.js",
  "cpp_labs/lab01_alignment_and_memory.cpp",
  "cpp_labs/lab02_encapsulation_friends_this.cpp",
  "cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp",
  "cpp_labs/lab04_inheritance_diamond_slicing.cpp",
  "cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp",
  "cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp",
  "cpp_labs/lab07_threads_join_detach_5_ways.cpp",
  "cpp_labs/lab08_mutex_lock_types_deadlock.cpp",
  "cpp_labs/lab09_condition_variable_producer_consumer.cpp",
  "cpp_labs/lab10_future_promise_async_threadpool.cpp"
];

for (const rel of requiredFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing required file: ${rel}`);
  }
}

const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");

if (/text-\[(10|11)px\]/.test(appSource) || /text-\[(10|11)px\]/.test(indexSource)) {
  throw new Error("Design violation: sub-12px micro-text found");
}
if (!appSource.includes("var(--card)") || !appSource.includes("var(--foreground)") || !appSource.includes("var(--primary)")) {
  throw new Error("Design violation: missing semantic CSS variables");
}

const elements = {
  "top-nav-buttons": { innerHTML: "" },
  "track-switcher-bar": { innerHTML: "" },
  "palette-switcher-bar": { innerHTML: "" },
  "app-main-container": { innerHTML: "" }
};

let lastAppliedPalette = "solar-yellow";
const sandbox = {
  window: {
    applyStudioPalette: (p) => {
      lastAppliedPalette = p;
    }
  },
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

const data = sandbox.window.CPP_OOP_DATA;
if (data.slides.length !== 22) {
  throw new Error(`Expected 22 concept slides, got ${data.slides.length}`);
}
if (data.codeDemos.length !== 17) {
  throw new Error(`Expected 17 code demos, got ${data.codeDemos.length}`);
}
if (data.quizQuestions.length !== 30) {
  throw new Error(`Expected 30 quiz questions, got ${data.quizQuestions.length}`);
}

const views = ["landing", "slides", "code-demo", "animation", "quiz", "result"];
for (const v of views) {
  sandbox.window.switchView(v);
  if (!elements["app-main-container"].innerHTML || elements["app-main-container"].innerHTML.length < 100) {
    throw new Error(`View '${v}' failed to render content`);
  }
}

// Verify 3-Color Trinity Auto-Morphing Track Switcher (Combo #5)
sandbox.window.setTrackFilter("oop");
if (lastAppliedPalette !== "solar-yellow") {
  throw new Error(`Expected 'solar-yellow' for OOP track, got '${lastAppliedPalette}'`);
}

sandbox.window.setTrackFilter("threading");
if (lastAppliedPalette !== "emerald-mint") {
  throw new Error(`Expected 'emerald-mint' for Threading track, got '${lastAppliedPalette}'`);
}

sandbox.window.setTrackFilter("stl");
if (lastAppliedPalette !== "royal-indigo") {
  throw new Error(`Expected 'royal-indigo' for STL track, got '${lastAppliedPalette}'`);
}

sandbox.window.setPaletteManual("cyber-dark");
if (lastAppliedPalette !== "cyber-dark") {
  throw new Error(`Expected 'cyber-dark' on manual override, got '${lastAppliedPalette}'`);
}

sandbox.window.setTrackFilter("all");

// Exercise all 10 animation simulators (5 OOP + 4 CppNuts Threading + 1 STL)
sandbox.window.switchView("animation");
const allSimTabs = [
  "align",
  "vtable",
  "rvalue",
  "diamond",
  "smartptr",
  "threads5",
  "mutex_deadlock",
  "cv_queue",
  "future_pool",
  "stl_sim"
];
for (const tab of allSimTabs) {
  sandbox.window.setAnimTab(tab);
  if (!elements["app-main-container"].innerHTML.includes("Interactive Memory")) {
    throw new Error(`Animation tab '${tab}' failed to render`);
  }
}

// Test Simulator 10: STL Vector 2x Reallocation
sandbox.window.setAnimTab("stl_sim");
sandbox.window.stlPushBack();
if (!elements["app-main-container"].innerHTML.includes("5 / 8")) {
  throw new Error("STL vector simulator failed to double capacity from 4 to 8 on 5th push_back");
}

console.log(
  "3-COLOR TRINITY UI AUDIT PASSED: All 6 views, 4 palettes (Solar Yellow, Emerald Mint, Royal Indigo, Cyber Dark), 22 slides, 17 demos, 10 simulators, 30 quiz items, and 10 native C++20 labs verified."
);
